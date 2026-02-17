import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { Button, Input } from '@/components/atoms'
import ImageUploader from './ImageUploader'
import type { Cell } from '@/types/checklist.types'

export interface CellEditorProps {
  cell: Cell
  onUpdate: (updates: Partial<Cell>) => void
  onClose: () => void
}

const CellEditor: React.FC<CellEditorProps> = ({ cell, onUpdate, onClose }) => {
  const [localValue, setLocalValue] = useState(cell.value)
  const [localSubFields, setLocalSubFields] = useState(cell.subFields)
  const [newSubField, setNewSubField] = useState('')
  const [localStyle, setLocalStyle] = useState(cell.style)
  const [localImage, setLocalImage] = useState(cell.image)

  const handleSave = () => {
    onUpdate({
      value: localValue,
      subFields: localSubFields,
      style: localStyle,
      image: localImage,
    })
    onClose()
  }

  const addSubField = () => {
    if (newSubField.trim()) {
      setLocalSubFields([...localSubFields, newSubField.trim()])
      setNewSubField('')
    }
  }

  const removeSubField = (index: number) => {
    setLocalSubFields(localSubFields.filter((_, i) => i !== index))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Cell</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Value */}
          <div>
            <Input
              label="Cell Value"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              placeholder="Enter cell value"
            />
          </div>

          {/* Sub-fields */}
          <div>
            <label className="block text-sm font-medium mb-2">Sub-Fields</label>
            <div className="space-y-2 mb-3">
              {localSubFields.map((subField, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={subField}
                    onChange={(e) => {
                      const updated = [...localSubFields]
                      updated[index] = e.target.value
                      setLocalSubFields(updated)
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSubField}
                onChange={(e) => setNewSubField(e.target.value)}
                placeholder="Add sub-field"
                onKeyPress={(e) => e.key === 'Enter' && addSubField()}
                className="flex-1"
              />
              <Button onClick={addSubField} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Styling */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <select
                value={localStyle.fontSize}
                onChange={(e) =>
                  setLocalStyle({ ...localStyle, fontSize: e.target.value })
                }
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Font Color</label>
              <input
                type="color"
                value={localStyle.fontColor}
                onChange={(e) =>
                  setLocalStyle({ ...localStyle, fontColor: e.target.value })
                }
                className="w-full h-10 rounded-md border border-input cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <input
                type="color"
                value={localStyle.backgroundColor || '#ffffff'}
                onChange={(e) =>
                  setLocalStyle({ ...localStyle, backgroundColor: e.target.value })
                }
                className="w-full h-10 rounded-md border border-input cursor-pointer"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localStyle.bold}
                  onChange={(e) =>
                    setLocalStyle({ ...localStyle, bold: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm font-medium">Bold</span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <ImageUploader value={localImage} onChange={setLocalImage} />
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CellEditor
