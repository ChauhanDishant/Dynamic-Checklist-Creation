import React, { useState } from 'react'
import { Plus, Trash2, Settings2, Download, RotateCcw, RotateCw } from 'lucide-react'
import { Button, Input } from '@/components/atoms'
import { HeaderConfigurator } from '@/components/molecules'
import { useChecklist } from '@/hooks'
import { exportToJSON, exportToExcel } from '@/utils/exportToExcel'
import ChecklistTable from './ChecklistTable'

const ChecklistFormPanel: React.FC = () => {
  const {
    checklist,
    setTitle,
    addRow,
    addRows,
    setColumns,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  } = useChecklist()

  const [showHeaderConfig, setShowHeaderConfig] = useState(false)
  const [bulkRowCount, setBulkRowCount] = useState(5)

  const handleBulkAdd = () => {
    if (bulkRowCount > 0 && bulkRowCount <= 100) {
      addRows(bulkRowCount)
    }
  }

  const handleExportJSON = () => {
    exportToJSON(checklist)
  }

  const handleExportExcel = async () => {
    await exportToExcel(checklist)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the checklist? This cannot be undone.')) {
      reset()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4 space-y-4 bg-card">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Checklist Builder</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Input
          label="Checklist Title"
          value={checklist.title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter checklist title"
        />

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={showHeaderConfig ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowHeaderConfig(!showHeaderConfig)}
            className="w-full col-span-2"
          >
            <Settings2 className="h-4 w-4 mr-2" />
            {showHeaderConfig ? 'Close Configuration' : 'Configure Table Headers'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportJSON}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>

        {showHeaderConfig && (
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <HeaderConfigurator columns={checklist.columns} onColumnsChange={setColumns} />
          </div>
        )}
      </div>

      {/* Row Management */}
      <div className="border-b border-border p-4 space-y-3 bg-card">
        <h3 className="font-medium">Row Management</h3>
        
        <div className="flex gap-2">
          <Button onClick={addRow} size="sm" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
          <Button variant="destructive" size="sm" onClick={handleReset}>
            <Trash2 className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2 border border-input rounded-md px-3 py-1 bg-background w-32">
            <span className="text-sm font-medium whitespace-nowrap">Bulk Add:</span>
            <input
                type="number"
                min="1"
                max="100"
                value={bulkRowCount}
                onChange={(e) => setBulkRowCount(parseInt(e.target.value) || 1)}
                className="w-full bg-transparent border-none focus:outline-none h-8 text-sm"
                placeholder="#"
            />
          </div>
          <Button onClick={handleBulkAdd} variant="secondary" size="sm" className="flex-1">
            Add {bulkRowCount} Rows
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Total Rows: {checklist.rows.length} | Columns: {checklist.columns.length}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-4">
        <ChecklistTable />
      </div>
    </div>
  )
}

export default ChecklistFormPanel
