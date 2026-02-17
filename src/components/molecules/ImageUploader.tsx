import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/atoms'
import { compressImage, validateImageFile } from '@/utils/imageUtils'
import { cn } from '@/utils'

export interface ImageUploaderProps {
  value?: string
  onChange: (base64: string | undefined) => void
  maxSize?: number
  className?: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  maxSize = 5 * 1024 * 1024,
  className,
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      if (!file) return
      setError(undefined)
      setIsProcessing(true)

      try {
        // Validate file
        const validation = validateImageFile(file)
        if (!validation.valid) {
          setError(validation.error)
          setIsProcessing(false)
          return
        }

        // Compress and convert to Base64
        const base64 = await compressImage(file, 800, 600, 0.8)
        onChange(base64)
      } catch (err) {
        setError('Failed to process image')
        console.error(err)
      } finally {
        setIsProcessing(false)
      }
    },
    [onChange]
  )

  // Handle paste events
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item?.type.indexOf('image') !== -1) {
          const file = item?.getAsFile()
          if (file) {
            e.preventDefault() // Prevent default paste behavior
            // Reuse the onDrop logic for processing
            onDrop([file])
          }
          break
        }
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [onDrop])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize,
    multiple: false,
  })

  const removeImage = () => {
    onChange(undefined)
    setError(undefined)
  }

  return (
    <div className={cn('w-full', className)}>
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-auto max-h-64 object-contain rounded-lg border border-border"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50',
              isProcessing && 'opacity-50 pointer-events-none'
            )}
            {...({} as any)} // Fix for Framer Motion type mismatch onDrag
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Processing image...</p>
                </>
              ) : (
                <>
                  {isDragActive ? (
                    <Upload className="h-12 w-12 text-primary" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {isDragActive ? 'Drop image here' : 'Drag & drop image here'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      or click to browse (JPG, PNG, WebP - max 5MB)
                    </p>
                    <p className="text-xs text-primary mt-1 font-medium">
                        Tip: You can also paste (Ctrl+V) an image!
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default ImageUploader
