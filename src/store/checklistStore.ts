import { create, type StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChecklistStore, Checklist, Column, Cell, Row } from '@/types/checklist.types'
import { generateId, generateDefaultColumns } from '@/utils/generateColumns'

// Create initial empty checklist
const createEmptyChecklist = (): Checklist => ({
    id: generateId(),
    title: 'Untitled Checklist',
    version: 1,
    columns: generateDefaultColumns(3),
    rows: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
})

// Create empty cell for a column
const createEmptyCell = (_columnId: string): Cell => ({
    id: generateId(),
    value: '',
    subFields: [],
    style: {
        fontSize: '14px',
        fontColor: '#000000',
        bold: false,
    },
})

// Create empty row with cells for all columns
const createEmptyRow = (columns: Column[], rowNumber: number): Row => {
    const cells: Record<string, Cell> = {}
    columns.forEach((column) => {
        cells[column.id] = createEmptyCell(column.id)
    })

    return {
        id: generateId(),
        cells,
        rowNumber,
    }
}

// Add to history for undo/redo
const addToHistory = (
    state: ChecklistStore,
    newChecklist: Checklist
): Pick<ChecklistStore, 'history' | 'historyIndex'> => {
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push({ ...newChecklist })

    // Limit history to 50 items
    if (newHistory.length > 50) {
        newHistory.shift()
    }

    return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
    }
}

type ChecklistStoreCreator = StateCreator<ChecklistStore, [['zustand/persist', unknown]], []>

const storeCreator: ChecklistStoreCreator = (set, get) => ({
    checklist: createEmptyChecklist(),
    history: [],
    historyIndex: -1,

    // Checklist actions
    setTitle: (title: string) => {
        set((state) => {
            const updated = {
                ...state.checklist,
                title,
                updatedAt: new Date().toISOString(),
            }
            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    // Column actions
    addColumn: (column: Omit<Column, 'id'>) => {
        set((state) => {
            if (state.checklist.columns.length >= 10) {
                console.warn('Maximum 10 columns allowed')
                return state
            }

            const newColumn: Column = {
                ...column,
                id: generateId(),
            }

            // Add empty cell for this column to all existing rows
            const updatedRows = state.checklist.rows.map((row) => ({
                ...row,
                cells: {
                    ...row.cells,
                    [newColumn.id]: createEmptyCell(newColumn.id),
                },
            }))

            const updated = {
                ...state.checklist,
                columns: [...state.checklist.columns, newColumn],
                rows: updatedRows,
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    updateColumn: (id: string, updates: Partial<Column>) => {
        set((state) => {
            const updated = {
                ...state.checklist,
                columns: state.checklist.columns.map((col) =>
                    col.id === id ? { ...col, ...updates } : col
                ),
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    removeColumn: (id: string) => {
        set((state) => {
            if (state.checklist.columns.length <= 1) {
                console.warn('At least one column is required')
                return state
            }

            // Remove cells for this column from all rows
            const updatedRows = state.checklist.rows.map((row) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [id]: removed, ...remainingCells } = row.cells
                return {
                    ...row,
                    cells: remainingCells,
                }
            })

            const updated = {
                ...state.checklist,
                columns: state.checklist.columns.filter((col) => col.id !== id),
                rows: updatedRows,
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    setColumns: (columns: Column[]) => {
        set((state) => {
            // Update all rows to match new columns
            const updatedRows = state.checklist.rows.map((row) => {
                const newCells: Record<string, Cell> = {}
                columns.forEach((col) => {
                    newCells[col.id] = row.cells[col.id] || createEmptyCell(col.id)
                })
                return {
                    ...row,
                    cells: newCells,
                }
            })

            const updated = {
                ...state.checklist,
                columns,
                rows: updatedRows,
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    // Row actions
    addRow: () => {
        set((state) => {
            const newRow = createEmptyRow(
                state.checklist.columns,
                state.checklist.rows.length + 1
            )

            const updated = {
                ...state.checklist,
                rows: [...state.checklist.rows, newRow],
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    addRows: (count: number) => {
        set((state) => {
            const newRows = Array.from({ length: count }, (_, i) =>
                createEmptyRow(
                    state.checklist.columns,
                    state.checklist.rows.length + i + 1
                )
            )

            const updated = {
                ...state.checklist,
                rows: [...state.checklist.rows, ...newRows],
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    removeRow: (id: string) => {
        set((state) => {
            const updatedRows = state.checklist.rows
                .filter((row) => row.id !== id)
                .map((row, index) => ({ ...row, rowNumber: index + 1 }))

            const updated = {
                ...state.checklist,
                rows: updatedRows,
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    removeRows: (ids: string[]) => {
        set((state) => {
            const updatedRows = state.checklist.rows
                .filter((row) => !ids.includes(row.id))
                .map((row, index) => ({ ...row, rowNumber: index + 1 }))

            const updated = {
                ...state.checklist,
                rows: updatedRows,
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    duplicateRow: (id: string) => {
        set((state) => {
            const rowToDuplicate = state.checklist.rows.find((row) => row.id === id)
            if (!rowToDuplicate) return state

            const duplicatedRow: Row = {
                ...rowToDuplicate,
                id: generateId(),
                rowNumber: state.checklist.rows.length + 1,
                cells: Object.fromEntries(
                    Object.entries(rowToDuplicate.cells).map(([colId, cell]) => [
                        colId,
                        { ...cell, id: generateId() },
                    ])
                ),
            }

            const updated = {
                ...state.checklist,
                rows: [...state.checklist.rows, duplicatedRow],
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    reorderRows: (startIndex: number, endIndex: number) => {
        set((state) => {
            const rows = [...state.checklist.rows]
            const [removed] = rows.splice(startIndex, 1)
            if (removed) rows.splice(endIndex, 0, removed)

            // Update row numbers
            const updatedRows = rows.map((row, index) => ({
                ...row,
                rowNumber: index + 1,
            }))

            const updated = {
                ...state.checklist,
                rows: updatedRows,
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    // Cell actions
    updateCell: (rowId: string, columnId: string, updates: Partial<Cell>) => {
        set((state) => {
            const updated = {
                ...state.checklist,
                rows: state.checklist.rows.map((row) =>
                    row.id === rowId
                        ? {
                            ...row,
                            cells: {
                                ...row.cells,
                                [columnId]: {
                                    ...row.cells[columnId]!,
                                    ...updates,
                                } as Cell,
                            },
                        }
                        : row
                ),
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    addSubField: (rowId: string, columnId: string, subField: string) => {
        set((state) => {
            const updated = {
                ...state.checklist,
                rows: state.checklist.rows.map((row) =>
                    row.id === rowId
                        ? {
                            ...row,
                            cells: {
                                ...row.cells,
                                [columnId]: {
                                    ...row.cells[columnId]!,
                                    subFields: [...row.cells[columnId]!.subFields, subField],
                                },
                            },
                        }
                        : row
                ),
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    removeSubField: (rowId: string, columnId: string, subFieldIndex: number) => {
        set((state) => {
            const updated = {
                ...state.checklist,
                rows: state.checklist.rows.map((row) =>
                    row.id === rowId
                        ? {
                            ...row,
                            cells: {
                                ...row.cells,
                                [columnId]: {
                                    ...row.cells[columnId]!,
                                    subFields: row.cells[columnId]!.subFields.filter(
                                        (_: unknown, i: number) => i !== subFieldIndex
                                    ),
                                },
                            },
                        }
                        : row
                ),
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    updateSubField: (
        rowId: string,
        columnId: string,
        subFieldIndex: number,
        value: string
    ) => {
        set((state) => {
            const updated = {
                ...state.checklist,
                rows: state.checklist.rows.map((row) =>
                    row.id === rowId
                        ? {
                            ...row,
                            cells: {
                                ...row.cells,
                                [columnId]: {
                                    ...row.cells[columnId]!,
                                    subFields: row.cells[columnId]!.subFields.map((sf: string, i: number) =>
                                        i === subFieldIndex ? value : sf
                                    ),
                                },
                            },
                        }
                        : row
                ),
                updatedAt: new Date().toISOString(),
            }

            return {
                checklist: updated,
                ...addToHistory(state, updated),
            }
        })
    },

    // History actions
    undo: () => {
        set((state) => {
            if (state.historyIndex > 0) {
                const newIndex = state.historyIndex - 1
                return {
                    checklist: state.history[newIndex],
                    historyIndex: newIndex,
                }
            }
            return state
        })
    },

    redo: () => {
        set((state) => {
            if (state.historyIndex < state.history.length - 1) {
                const newIndex = state.historyIndex + 1
                return {
                    checklist: state.history[newIndex],
                    historyIndex: newIndex,
                }
            }
            return state
        })
    },

    canUndo: () => {
        return get().historyIndex > 0
    },

    canRedo: () => {
        return get().historyIndex < get().history.length - 1
    },

    // Utility actions
    reset: () => {
        set({
            checklist: createEmptyChecklist(),
            history: [],
            historyIndex: -1,
        })
    },

    loadChecklist: (checklist: Checklist) => {
        set((state) => ({
            checklist,
            ...addToHistory(state, checklist),
        }))
    },
})

export const useChecklistStore = create<ChecklistStore>()(
    persist(storeCreator, {
        name: 'checklist-storage',
        version: 1,
    })
)
