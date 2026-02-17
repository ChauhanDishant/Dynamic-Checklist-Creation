import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import type { Checklist } from '@/types/checklist.types'

/**
 * Export to Excel with full styling and images
 */
export const exportToExcel = async (checklist: Checklist): Promise<void> => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Checklist')

  // Set creator and properties
  workbook.creator = 'Dynamic Checklist Creator'
  workbook.created = new Date()

  // Define Columns
  worksheet.columns = checklist.columns.map((col) => ({
    header: col.label,
    key: col.id,
    width: col.width ? Math.max(col.width, 20) : 30, // Use column width directly or default to 30
    style: {
      font: {
        name: 'Arial',
        size: parseInt(col.style.fontSize) || 12,
        bold: col.style.bold,
        color: { argb: col.style.fontColor.replace('#', '') }
      }
    }
  }))

  // Style Header Row
  const headerRow = worksheet.getRow(1)
  headerRow.font = { name: 'Arial', bold: true, size: 14, color: { argb: 'FFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '2c3e50' } // Dark blue-gray
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
  headerRow.height = 30

  // Add Rows and Images
  for (let i = 0; i < checklist.rows.length; i++) {
    const row = checklist.rows[i]
    if (!row) continue

    const rowData: Record<string, string> = {}

    // Prepare text data
    checklist.columns.forEach((col) => {
      const cell = row.cells[col.id]
      if (!cell) return

      let cellText = cell.value || ''

      // Append sub-fields
      if (cell.subFields && cell.subFields.length > 0) {
        cellText += '\n' + cell.subFields.map(sf => `• ${sf}`).join('\n')
      }

      rowData[col.id] = cellText
    })

    const excelRow = worksheet.addRow(rowData)

    // Adjust row height if there are sub-fields or images
    let maxLineCount = 1
    checklist.columns.forEach((col) => {
      const cell = row.cells[col.id]
      if (!cell) return

      if (cell.subFields.length > 0) maxLineCount = Math.max(maxLineCount, cell.subFields.length + 2)
      if (cell.image) maxLineCount = Math.max(maxLineCount, 12) // ~240px height for images
    })
    excelRow.height = maxLineCount * 20

    // Apply granular cell styles and add images
    checklist.columns.forEach((col) => {
      const cell = row.cells[col.id]
      if (!cell) return

      const excelCell = excelRow.getCell(col.id)

      // Apply cell-specific styling overrides
      if (cell.style) {
        excelCell.font = {
          name: 'Arial',
          size: parseInt(cell.style.fontSize) || 12,
          bold: cell.style.bold,
          color: { argb: cell.style.fontColor.replace('#', '') }
        }
      }

      // Borders
      excelCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }

      // Alignment
      excelCell.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' }

      // Handle Image
      if (cell.image) {
        // Convert Base64 to buffer/native format for exceljs
        const imageId = workbook.addImage({
          base64: cell.image,
          extension: 'png', // Assuming png/jpeg, exceljs auto-detects from base64 usually
        })

        worksheet.addImage(imageId, {
          tl: { col: checklist.columns.indexOf(col), row: excelRow.number - 1 },
          ext: { width: 200, height: 200 },
          editAs: 'oneCell'
        })
      }
    })
  }

  // Generate Buffer
  const buffer = await workbook.xlsx.writeBuffer()

  // Save File
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, `${checklist.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

/**
 * Placeholder for PDF export functionality
 * To be implemented with a library like jsPDF or pdfmake
 */
export const exportToPDF = async (checklist: Checklist): Promise<void> => {
  console.log('PDF export not yet implemented', checklist)
  alert('PDF export feature coming soon!')
}

/**
 * Export to JSON
 */
export const exportToJSON = (checklist: Checklist): void => {
  const dataStr = JSON.stringify(checklist, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  saveAs(dataBlob, `${checklist.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`)
}

