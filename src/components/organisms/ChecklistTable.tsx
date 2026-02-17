import React, { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Copy, Trash2 } from 'lucide-react'
import { Button, Checkbox } from '@/components/atoms'
import { CellEditor } from '@/components/molecules'
import { useChecklist } from '@/hooks'
import type { Row, Cell, Column } from '@/types/checklist.types'

interface SortableRowProps {
  row: Row
  columns: Column[]
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onEditCell: (rowId: string, columnId: string) => void
  onDuplicate: () => void
  onDelete: () => void
}

const SortableRow: React.FC<SortableRowProps> = ({
  row,
  columns,
  isSelected,
  onSelect,
  onEditCell,
  onDuplicate,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr ref={setNodeRef} style={style} className="group hover:bg-accent/30">
      <td className="text-center">
        <div className="flex items-center justify-center gap-2">
          <div {...attributes} {...listeners} className="drag-handle cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4" />
          </div>
          <Checkbox checked={isSelected} onChange={(e) => onSelect(e.target.checked)} />
        </div>
      </td>
      <td className="text-center font-medium">{row.rowNumber}</td>
      {columns.map((column) => {
        const cell = row.cells[column.id]
        return (
          <td
            key={column.id}
            className="cursor-pointer hover:bg-primary/5 transition-colors border border-border p-2 relative"
            style={{ 
              width: `${column.width}%`,
              color: cell?.style?.fontColor,
              fontSize: cell?.style?.fontSize,
              fontWeight: cell?.style?.bold ? 'bold' : 'normal',
              backgroundColor: cell?.style?.backgroundColor,
            }}
            onClick={() => onEditCell(row.id, column.id)}
          >
            {cell?.value && <div className="truncate">{cell.value}</div>}
            {cell?.subFields && cell.subFields.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                {cell.subFields.map((sf, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span className="truncate max-w-full">{sf}</span>
                  </div>
                ))}
              </div>
            )}
            {cell?.image && (
                <div className="mt-2">
                    <img 
                        src={cell.image} 
                        alt="Cell content" 
                        className="max-w-[150px] max-h-[150px] rounded-md border border-border object-cover"
                    />
                </div>
            )}
          </td>
        )
      })}
      <td>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

const ChecklistTable: React.FC = () => {
  const { checklist, removeRow, duplicateRow, reorderRows, updateCell } = useChecklist()
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = checklist.rows.findIndex((row) => row.id === active.id)
      const newIndex = checklist.rows.findIndex((row) => row.id === over.id)
      reorderRows(oldIndex, newIndex)
    }
  }

  const toggleRowSelection = (rowId: string, checked: boolean) => {
    const newSelection = new Set(selectedRows)
    if (checked) {
      newSelection.add(rowId)
    } else {
      newSelection.delete(rowId)
    }
    setSelectedRows(newSelection)
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(checklist.rows.map((r) => r.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleEditCell = (rowId: string, columnId: string) => {
    setEditingCell({ rowId, columnId })
  }

  const handleUpdateCell = (updates: Partial<Cell>) => {
    if (editingCell) {
      updateCell(editingCell.rowId, editingCell.columnId, updates)
      setEditingCell(null)
    }
  }

  if (checklist.rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No rows yet. Add rows to get started.</p>
      </div>
    )
  }

  const currentCell = editingCell
    ? checklist.rows.find((r) => r.id === editingCell.rowId)?.cells[editingCell.columnId]
    : null

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="w-20 p-2 border border-border">
                <Checkbox
                  checked={selectedRows.size === checklist.rows.length && checklist.rows.length > 0}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="w-12 p-2 border border-border">#</th>
              {checklist.columns.map((column) => (
                <th 
                    key={column.id} 
                    className="p-2 border border-border text-left"
                    style={{ 
                        width: `${column.width}%`,
                        color: column.style.fontColor,
                        fontSize: column.style.fontSize,
                        fontWeight: column.style.bold ? 'bold' : 'normal',
                    }}
                >
                  {column.label}
                </th>
              ))}
              <th className="w-24 p-2 border border-border">Actions</th>
            </tr>
          </thead>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={checklist.rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
              <tbody>
                {checklist.rows.map((row) => (
                  <SortableRow
                    key={row.id}
                    row={row}
                    columns={checklist.columns}
                    isSelected={selectedRows.has(row.id)}
                    onSelect={(checked) => toggleRowSelection(row.id, checked)}
                    onEditCell={handleEditCell}
                    onDuplicate={() => duplicateRow(row.id)}
                    onDelete={() => removeRow(row.id)}
                  />
                ))}
              </tbody>
            </SortableContext>
          </DndContext>
        </table>
      </div>

      {editingCell && currentCell && (
        <CellEditor
          cell={currentCell}
          onUpdate={handleUpdateCell}
          onClose={() => setEditingCell(null)}
        />
      )}
    </>
  )
}

export default ChecklistTable
