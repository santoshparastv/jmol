// Utility to parse Google Sheets data
// You can paste the sheet data here or import from CSV/Excel

export interface SheetRow {
  [key: string]: string | number
}

/**
 * Parse pasted Google Sheets data (tab-separated or CSV format)
 * @param pastedData - Data pasted from Google Sheets
 * @returns Array of row objects
 */
export function parseSheetData(pastedData: string): SheetRow[] {
  const lines = pastedData.trim().split('\n')
  if (lines.length === 0) return []

  // First line is headers
  const headers = lines[0].split('\t').map(h => h.trim())
  
  const rows: SheetRow[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t')
    const row: SheetRow = {}
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || ''
      // Try to parse as number if possible
      const numValue = parseFloat(value)
      row[header] = isNaN(numValue) ? value : numValue
    })
    
    rows.push(row)
  }
  
  return rows
}

/**
 * Extract formulas from Google Sheets
 * Steps:
 * 1. In Google Sheets, select the range with formulas
 * 2. Copy (Ctrl+C / Cmd+C)
 * 3. Paste here as text
 * 4. This will help identify which cells have formulas
 */
export function extractFormulas(sheetData: string): { [cell: string]: string } {
  // This is a placeholder - you'll need to paste the formulas
  // Format: "Cell Reference: Formula"
  // Example: "B5: =NetSalary*0.4"
  
  const formulas: { [cell: string]: string } = {}
  
  // You can paste formulas here in format:
  // B5: =NetSalary*0.4
  // B6: =B5*0.5
  // etc.
  
  return formulas
}

/**
 * Convert Google Sheets formula to JavaScript
 * This is a helper - you'll need to manually convert based on your formulas
 */
export function convertFormulaToJS(formula: string): string {
  // Basic conversions
  let jsCode = formula
  
  // Remove = sign
  jsCode = jsCode.replace(/^=/, '')
  
  // Convert IF statements
  jsCode = jsCode.replace(/IF\(([^,]+),([^,]+),([^)]+)\)/g, '($1 ? $2 : $3)')
  
  // Convert cell references (you'll need to map these)
  // Example: B5 -> basic, B6 -> hra, etc.
  
  return jsCode
}
