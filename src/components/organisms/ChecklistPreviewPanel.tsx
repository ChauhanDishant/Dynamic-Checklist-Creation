import React from 'react'
import { motion } from 'framer-motion'
import type { Checklist } from '@/types/checklist.types'

export interface ChecklistPreviewPanelProps {
  checklist: Checklist
}

const ChecklistPreviewPanel: React.FC<ChecklistPreviewPanelProps> = ({ checklist }) => {
  if (checklist.rows.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">No rows yet</p>
          <p className="text-muted-foreground text-sm mt-2">
            Add rows to see your checklist preview
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-6 bg-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-lg shadow-lg p-6"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">{checklist.title}</h1>

        <div className="overflow-x-auto">
          <table className="checklist-table">
            <thead>
              <tr>
                <th className="w-12">#</th>
                {checklist.columns.map((column) => (
                  <th
                    key={column.id}
                    style={{
                      width: `${column.width}%`,
                      fontSize: column.style.fontSize,
                      color: column.style.fontColor,
                      fontWeight: column.style.bold ? 'bold' : 'normal',
                    }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {checklist.rows.map((row) => (
                <tr key={row.id}>
                  <td className="text-center font-medium text-muted-foreground">
                    {row.rowNumber}
                  </td>
                  {checklist.columns.map((column) => {
                    const cell = row.cells[column.id]
                    if (!cell) return <td key={column.id}></td>

                    return (
                      <td
                        key={column.id}
                        style={{
                          fontSize: cell.style.fontSize,
                          color: cell.style.fontColor,
                          fontWeight: cell.style.bold ? 'bold' : 'normal',
                          backgroundColor: cell.style.backgroundColor,
                        }}
                      >
                        {cell.value && (
                          <div className="whitespace-pre-wrap">{cell.value}</div>
                        )}

                        {cell.subFields.length > 0 && (
                          <ul className="sub-field-list">
                            {cell.subFields.map((subField, idx) => (
                              <li key={idx} className="sub-field-item">
                                {subField}
                              </li>
                            ))}
                          </ul>
                        )}

                        {cell.image && (
                          <img
                            src={cell.image}
                            alt="Cell content"
                            className="cell-image"
                          />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Last updated: {new Date(checklist.updatedAt).toLocaleString()}
        </div>
      </motion.div>
    </div>
  )
}

export default ChecklistPreviewPanel
