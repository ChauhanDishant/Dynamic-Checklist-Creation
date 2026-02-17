import { v4 as uuidv4 } from 'uuid'

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return uuidv4()
}

/**
 * Generate default columns based on count
 */
export const generateDefaultColumns = (count: number) => {
  const columns = []
  const defaultWidth = Math.floor(100 / count)
  
  for (let i = 0; i < count; i++) {
    columns.push({
      id: generateId(),
      label: `Column ${i + 1}`,
      width: defaultWidth,
      style: {
        fontSize: '14px',
        fontColor: '#000000',
        bold: false,
      },
    })
  }
  
  return columns
}

/**
 * Calculate auto-balanced column widths
 */
export const calculateColumnWidths = (columnCount: number): number[] => {
  const baseWidth = Math.floor(100 / columnCount)
  const remainder = 100 - baseWidth * columnCount
  
  return Array.from({ length: columnCount }, (_, i) => 
    i < remainder ? baseWidth + 1 : baseWidth
  )
}

/**
 * Validate column configuration
 */
export const validateColumns = (columns: { label: string }[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (columns.length === 0) {
    errors.push('At least one column is required')
  }
  
  if (columns.length > 10) {
    errors.push('Maximum 10 columns allowed')
  }
  
  const labels = columns.map(c => c.label.trim().toLowerCase())
  const duplicates = labels.filter((label, index) => labels.indexOf(label) !== index)
  
  if (duplicates.length > 0) {
    errors.push('Column names must be unique')
  }
  
  const emptyLabels = columns.filter(c => !c.label.trim())
  if (emptyLabels.length > 0) {
    errors.push('All columns must have a label')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}
