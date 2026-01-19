// Google Sheets API integration
// To use this, you'll need to set up Google Sheets API credentials

const SPREADSHEET_ID = '1kwDlSYN2maubVvT8ccZZ9skqHkgis8cdJBTUvCQjQlc'
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || ''

/**
 * Fetch data from Google Sheets using the public API
 * Note: This only works if the sheet is publicly viewable
 */
export async function fetchSheetData(range: string, sheetName: string = 'CTC Auto Calculator') {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.values || []
  } catch (error) {
    console.error('Error fetching sheet data:', error)
    throw error
  }
}

/**
 * Get formulas from a specific range
 * Note: This requires the sheet to be publicly accessible or proper authentication
 */
export async function getFormulas(range: string, sheetName: string = 'CTC Auto Calculator') {
  try {
    // This would require OAuth or service account for private sheets
    // For now, we'll use the public API which only returns values
    const values = await fetchSheetData(range, sheetName)
    return values
  } catch (error) {
    console.error('Error getting formulas:', error)
    throw error
  }
}

/**
 * Parse pasted sheet data (when user copies from Google Sheets)
 */
export function parsePastedSheetData(pastedText: string) {
  const rows = pastedText.split('\n').map(row => row.split('\t'))
  
  if (rows.length === 0) return { headers: [], data: [] }
  
  const headers = rows[0]
  const data = rows.slice(1).map(row => {
    const obj: { [key: string]: string } = {}
    headers.forEach((header, index) => {
      obj[header] = row[index] || ''
    })
    return obj
  })
  
  return { headers, data }
}
