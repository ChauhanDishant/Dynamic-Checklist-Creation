import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils'

export interface TwoColumnLayoutProps {
  left: React.ReactNode
  right: React.ReactNode
  className?: string
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({ left, right, className }) => {
  const [leftWidth, setLeftWidth] = useState(50)
  const [isResizing, setIsResizing] = useState(false)

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing) return

    const container = e.currentTarget as HTMLElement
    const containerRect = container.getBoundingClientRect()
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

    if (newLeftWidth >= 30 && newLeftWidth <= 70) {
      setLeftWidth(newLeftWidth)
    }
  }

  React.useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  return (
    <div
      className={cn('flex h-screen w-full overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left Panel */}
      <motion.div
        className="h-full overflow-hidden border-r border-border bg-background"
        style={{ width: `${leftWidth}%` }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {left}
      </motion.div>

      {/* Resize Handle */}
      <div
        className={cn(
          'w-1 cursor-col-resize bg-border hover:bg-primary transition-colors relative group',
          isResizing && 'bg-primary'
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10" />
      </div>

      {/* Right Panel */}
      <motion.div
        className="h-full overflow-hidden bg-muted/20"
        style={{ width: `${100 - leftWidth}%` }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {right}
      </motion.div>
    </div>
  )
}

export default TwoColumnLayout
