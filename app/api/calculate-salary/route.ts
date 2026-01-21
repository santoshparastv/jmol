import { NextRequest, NextResponse } from 'next/server'
import { calculateSalaryBreakdown, type SalaryBreakdown } from '@/lib/salaryCalculator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { netSalary, state, pfEnabled, travelAllowance, doj } = body

    if (!netSalary || !state) {
      return NextResponse.json(
        { error: 'Net salary and state are required' },
        { status: 400 }
      )
    }

    const parsedNetSalary = parseFloat(netSalary)
    const pfEnabledBool = pfEnabled !== undefined ? pfEnabled : true
    
    // Extract month from Date of Joining (DOJ) if provided
    // Format: "YYYY-MM-DD" or "DD-MM-YYYY" or "DD/MM/YYYY"
    let month: number | undefined
    if (doj) {
      try {
        const date = new Date(doj)
        if (!isNaN(date.getTime())) {
          month = date.getMonth() + 1 // JavaScript months are 0-indexed (0=Jan, 11=Dec), so add 1
        }
      } catch (e) {
        // If date parsing fails, month will remain undefined and default to current month
      }
    }
    
    let salaryBreakdown: SalaryBreakdown

    // PF guardrail:
    // If PF is selected "No", calculate a strict PF-off scenario to validate
    // whether PF is mandatory (Basic Salary <= 15,000).
    if (pfEnabledBool === false) {
      const strictPfOff = calculateSalaryBreakdown(parsedNetSalary, state, false, {
        enforcePfMandatory: false,
        month,
      })

      if (strictPfOff.basic <= 15000) {
        return NextResponse.json(
          { error: 'PF is mandatory for Basic Salary ≤ ₹15,000. Please select "Yes" for PF.' },
          { status: 400 }
        )
      }

      // Use strict PF-off breakdown as the result
      // (PF stays off because Basic is above the mandatory threshold).
      salaryBreakdown = strictPfOff
    } else {
      // Normal behaviour: allow PF and enforce mandatory PF rule.
      salaryBreakdown = calculateSalaryBreakdown(parsedNetSalary, state, true, { month })
    }

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
