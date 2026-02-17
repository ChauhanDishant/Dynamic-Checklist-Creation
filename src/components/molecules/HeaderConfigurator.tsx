import React, { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import { Button, Input, Select } from '@/components/atoms'
import {validateColumns } from '@/utils/generateColumns'
import type { Column } from '@/types/checklist.types'
import { generateId } from '@/utils/generateColumns'

export interface HeaderConfiguratorProps {
  columns: Column[]
  onColumnsChange: (columns: Column[]) => void
}

const HeaderConfigurator: React.FC<HeaderConfiguratorProps> = ({
  columns,
  onColumnsChange,
}) => {
  const [columnCount, setColumnCount] = useState(columns.length)
  const [localColumns, setLocalColumns] = useState(columns)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    setLocalColumns(columns)
    setColumnCount(columns.length)
  }, [columns])

  const handleColumnCountChange = (count: number) => {
    setColumnCount(count)
    let newColumns = [...localColumns]
    
    if (count > localColumns.length) {
      // Add new columns
      for (let i = localColumns.length; i < count; i++) {
        newColumns.push({
          id: generateId(),
          label: `Column ${i + 1}`,
          width: Math.floor(100 / count),
          style: {
            fontSize: '14px',
            fontColor: '#000000',
            bold: false,
          },
        })
      }
    } else {
      // Remove columns
      newColumns = localColumns.slice(0, count)
    }
    
    setLocalColumns(newColumns)
    onColumnsChange(newColumns)
    
    // Validate but don't block
    const validation = validateColumns(newColumns)
    setErrors(validation.valid ? [] : validation.errors)
  }

  const updateColumn = (index: number, updates: Partial<Column>) => {
    const updated = [...localColumns]
    updated[index] = { ...updated[index], ...updates } as Column
    setLocalColumns(updated)
    
    onColumnsChange(updated)
    
    // Validate
    const validation = validateColumns(updated)
    setErrors(validation.valid ? [] : validation.errors)
  }

  const balanceWidths = () => {
    const equalWidth = Math.floor(100 / localColumns.length)
    const updated = localColumns.map((col) => ({
      ...col,
      width: equalWidth,
    }))
    setLocalColumns(updated)
    onColumnsChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select
          label="Number of Columns"
          value={columnCount.toString()}
          onChange={(e) => handleColumnCountChange(parseInt(e.target.value))}
          options={Array.from({ length: 10 }, (_, i) => ({
            value: (i + 1).toString(),
            label: `${i + 1} Column${i > 0 ? 's' : ''}`,
          }))}
          className="w-48"
        />
        <Button variant="outline" size="sm" onClick={balanceWidths} className="mt-6 h-10">
          <Settings className="h-6 w-6 mr-2" />
          Balance Widths
        </Button>
      </div>

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive rounded-md p-3">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-destructive">
              • {error}
            </p>
          ))}
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {localColumns.map((column, index) => (
          <div
            key={column.id}
            className="border border-border rounded-lg p-4 space-y-3 bg-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Column {index + 1}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Label"
                value={column.label}
                onChange={(e) => updateColumn(index, { label: e.target.value })}
                placeholder="Column name"
              />

              <Input
                label="Width (%)"
                type="number"
                min="5"
                max="100"
                value={column.width}
                onChange={(e) =>
                  updateColumn(index, { width: parseInt(e.target.value) || 10 })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Font Size</label>
                <select
                  value={column.style.fontSize}
                  onChange={(e) =>
                    updateColumn(index, {
                      style: { ...column.style, fontSize: e.target.value },
                    })
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Color</label>
                <input
                  type="color"
                  value={column.style.fontColor}
                  onChange={(e) =>
                    updateColumn(index, {
                      style: { ...column.style, fontColor: e.target.value },
                    })
                  }
                  className="w-full h-10 rounded-md border border-input cursor-pointer"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer h-10">
                  <input
                    type="checkbox"
                    checked={column.style.bold}
                    onChange={(e) =>
                      updateColumn(index, {
                        style: { ...column.style, bold: e.target.checked },
                      })
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-sm font-medium">Bold</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default HeaderConfigurator
