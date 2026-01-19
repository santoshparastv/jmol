import { NextRequest, NextResponse } from 'next/server'
import { calculateSalaryBreakdown } from '@/lib/salaryCalculator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { netSalary, state, pfEnabled, travelAllowance } = body

    if (!netSalary || !state) {
      return NextResponse.json(
        { error: 'Net salary and state are required' },
        { status: 400 }
      )
    }

    const salaryBreakdown = calculateSalaryBreakdown(
      parseFloat(netSalary),
      state,
      pfEnabled !== undefined ? pfEnabled : true
    )

    // Override travel allowance if provided and valid
    if (travelAllowance !== undefined && travelAllowance !== null && travelAllowance !== '') {
      const taValue = parseFloat(travelAllowance)
      if (!isNaN(taValue) && taValue > 0) {
        salaryBreakdown.travelAllowance = taValue
      } else {
        salaryBreakdown.travelAllowance = undefined
      }
    } else {
      salaryBreakdown.travelAllowance = undefined
    }

    return NextResponse.json(salaryBreakdown)
  } catch (error) {
    console.error('Error calculating salary:', error)
    return NextResponse.json(
      { error: 'Failed to calculate salary breakdown' },
      { status: 500 }
    )
  }
}
