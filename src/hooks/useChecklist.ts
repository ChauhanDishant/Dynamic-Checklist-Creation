import { useChecklistStore } from '@/store/checklistStore'
import type { Cell, Column } from '@/types/checklist.types'

/**
 * Custom hook for checklist operations
 * Provides convenient access to store actions and computed values
 */
export const useChecklist = () => {
  const store = useChecklistStore()

  // Computed values
  const totalRows = store.checklist.rows.length
  const totalColumns = store.checklist.columns.length
  const isEmpty = totalRows === 0

  // Helper to get cell by row and column ID
  const getCell = (rowId: string, columnId: string): Cell | undefined => {
    const row = store.checklist.rows.find((r) => r.id === rowId)
    return row?.cells[columnId]
  }

  // Helper to get column by ID
  const getColumn = (columnId: string): Column | undefined => {
    return store.checklist.columns.find((c) => c.id === columnId)
  }

  return {
    // State
    checklist: store.checklist,
    canUndo: store.canUndo(),
    canRedo: store.canRedo(),

    // Computed
    totalRows,
    totalColumns,
    isEmpty,

    // Actions
    setTitle: store.setTitle,
    addColumn: store.addColumn,
    updateColumn: store.updateColumn,
    removeColumn: store.removeColumn,
    setColumns: store.setColumns,
    addRow: store.addRow,
    addRows: store.addRows,
    removeRow: store.removeRow,
    removeRows: store.removeRows,
    duplicateRow: store.duplicateRow,
    reorderRows: store.reorderRows,
    updateCell: store.updateCell,
    addSubField: store.addSubField,
    removeSubField: store.removeSubField,
    updateSubField: store.updateSubField,
    undo: store.undo,
    redo: store.redo,
    reset: store.reset,
    loadChecklist: store.loadChecklist,

    // Helpers
    getCell,
    getColumn,
  }
}
