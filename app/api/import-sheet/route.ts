import { NextRequest, NextResponse } from 'next/server'
import { parseSheetData } from '@/lib/sheetParser'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sheetData } = body

    if (!sheetData) {
      return NextResponse.json(
        { error: 'Sheet data is required' },
        { status: 400 }
      )
    }

    // Parse the pasted sheet data
    const parsedData = parseSheetData(sheetData)

    return NextResponse.json({
      success: true,
      rows: parsedData,
      count: parsedData.length,
    })
  } catch (error) {
    console.error('Error parsing sheet data:', error)
    return NextResponse.json(
      { error: 'Failed to parse sheet data' },
      { status: 500 }
    )
  }
}
