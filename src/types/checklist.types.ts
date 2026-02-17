// Cell styling interface
export interface CellStyle {
  fontSize: string
  fontColor: string
  bold: boolean
  backgroundColor?: string
}

// Cell with nested sub-fields and optional image
export interface Cell {
  id: string
  value: string
  subFields: string[]
  style: CellStyle
  image?: string // Base64 or URL
}

// Row structure with cells mapped by column ID
export interface Row {
  id: string
  cells: Record<string, Cell>
  rowNumber: number
}

// Column definition
export interface Column {
  id: string
  label: string
  width: number // percentage
  style: CellStyle
}

// Complete checklist structure
export interface Checklist {
  id: string
  title: string
  version: number
  columns: Column[]
  rows: Row[]
  createdAt: string
  updatedAt: string
}

// Zustand store state and actions
export interface ChecklistStore {
  checklist: Checklist
  history: Checklist[]
  historyIndex: number
  
  // Checklist actions
  setTitle: (title: string) => void
  
  // Column actions
  addColumn: (column: Omit<Column, 'id'>) => void
  updateColumn: (id: string, updates: Partial<Column>) => void
  removeColumn: (id: string) => void
  setColumns: (columns: Column[]) => void
  
  // Row actions
  addRow: () => void
  addRows: (count: number) => void
  removeRow: (id: string) => void
  removeRows: (ids: string[]) => void
  duplicateRow: (id: string) => void
  reorderRows: (startIndex: number, endIndex: number) => void
  
  // Cell actions
  updateCell: (rowId: string, columnId: string, updates: Partial<Cell>) => void
  addSubField: (rowId: string, columnId: string, subField: string) => void
  removeSubField: (rowId: string, columnId: string, subFieldIndex: number) => void
  updateSubField: (rowId: string, columnId: string, subFieldIndex: number, value: string) => void
  
  // History actions
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  
  // Utility actions
  reset: () => void
  loadChecklist: (checklist: Checklist) => void
}

// Theme type
export type Theme = 'light' | 'dark'

// Export format type (for future use)
export type ExportFormat = 'pdf' | 'excel' | 'json'

// Form validation schemas (for React Hook Form)
export interface HeaderConfigForm {
  title: string
  columnCount: number
  columns: {
    label: string
    width: number
  }[]
}

export interface CellEditForm {
  value: string
  subFields: string[]
  fontSize: string
  fontColor: string
  bold: boolean
  backgroundColor?: string
}

// Keyboard shortcut type
export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}
