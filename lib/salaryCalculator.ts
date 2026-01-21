// Salary calculation based on formulas from Google Sheets "CTC Auto Calculator"
// Formulas extracted from: https://docs.google.com/spreadsheets/d/1kwDlSYN2maubVvT8ccZZ9skqHkgis8cdJBTUvCQjQlc

import { calculateProfessionalTax, getLWFForMonth, isESICApplicable } from './stateTaxMappings'

export interface SalaryBreakdown {
  basic: number
  hra: number
  specialAllowance: number
  bonusAmount: number
  grossTotalEarnings: number
  pfEmployee: number
  esiEmployee: number
  professionalTax: number
  employeeLWF: number
  medicclaimDeduction: number
  totalDeductions: number
  netSalary: number
  variableIncentive: number
  pfEmployer: number
  pfAdminCharge: number
  pfEDLICharge: number
  esiEmployer: number
  employerLWF: number
  totalBenefits: number
  ctc: number
  travelAllowance?: number
}

export interface SalaryCalculatorOptions {
  /**
   * If true (default), PF is forced on when basic <= 15000, even if pfEnabled is false.
   * If false, pfEnabled strictly controls whether PF is applied.
   */
  enforcePfMandatory?: boolean
  /**
   * Payroll month (1-12). Used for month-specific PT/LWF rules (e.g., Karnataka PT in Feb, LWF half-yearly/yearly deductions).
   * Defaults to 12 (December) to align with half-yearly/yearly deduction cycles.
   */
  month?: number
}

// Professional Tax, LWF, and ESIC are now calculated using stateTaxMappings.ts
// which contains state-wise slab rates and configurations

// PF Admin Charge and EDLI Charge (fixed values)
const PF_ADMIN_CHARGE = 55
const PF_EDLI_CHARGE = 55

// PF cap (monthly). Standard EPF wage ceiling is ₹15,000 => 12% = ₹1,800.
const PF_CAP = 1800

// From sheet example: 1200 is ~8.89% of 13500
const BONUS_RATE = 0.0889
const HRA_RATE = 0.4
const PF_RATE = 0.12
const ESI_EMPLOYEE_RATE = 0.0075
const ESI_EMPLOYER_RATE = 0.0325

/**
 * Calculate salary breakdown from Net Salary
 * Based on formulas from Google Sheets "CTC Auto Calculator"
 * 
 * Key formulas from sheet:
 * - Basic Salary: Input or calculated
 * - HRA: 40% of Basic Salary (Maximum 40% of Basic)
 * - Bonus Amount: Fixed or calculated
 * - Employee PF: 12% of Basic (capped at ₹1,800/month when applicable)
 * - Employee ESI: 0.75% of Basic (if Gross < 21000)
 * - Employer ESI: 3.25% of Gross (if Gross < 21000)
 * - Professional Tax: Fixed by state (200 for most states)
 * - LWF: Fixed by state (25 for Maharashtra)
 */
export function calculateSalaryBreakdown(
  netSalary: number,
  state: string,
  pfEnabled: boolean = true,
  options: SalaryCalculatorOptions = {}
): SalaryBreakdown {
  const enforcePfMandatory = options.enforcePfMandatory !== undefined ? options.enforcePfMandatory : true
  // Use provided month, or default to current month if not provided (1-12, where 1=January, 12=December)
  // This ensures LWF is only deducted in the correct months (e.g., half-yearly in June/December)
  // and Professional Tax special cases (e.g., Karnataka February = ₹300) are applied correctly
  const month = options.month || new Date().getMonth() + 1

  // Get state-specific values using the new mapping functions
  // Note: Professional tax calculation needs gross salary, so we'll calculate it in the loop
  const lwfConfig = getLWFForMonth(state, month)
  const employeeLWF = lwfConfig.employee
  const employerLWF = lwfConfig.employer
  
  /**
   * New requirement:
   * - Basic must be 50% of Monthly CTC.
   * - Add Special Allowance as a balancing earning so Net Salary (input) stays correct.
   *
   * We solve for Monthly CTC such that computed Net Salary matches the target netSalary.
   */
  const tolerance = 1 // rupees

  const computeFromMonthlyCTC = (monthlyCTC: number) => {
    const basic = monthlyCTC * 0.5
    const basicRounded = Math.round(basic)
    const hra = Math.round(basicRounded * HRA_RATE)
    const bonusAmount = Math.round(basicRounded * BONUS_RATE)

    const pfApplies = pfEnabled || (enforcePfMandatory && basicRounded <= 15000)
    const pfEmployee = pfApplies ? Math.min(PF_CAP, Math.round(basicRounded * PF_RATE)) : 0
    const pfEmployer = pfApplies ? Math.min(PF_CAP, Math.round(basicRounded * PF_RATE)) : 0
    const pfAdminCharge = pfApplies ? PF_ADMIN_CHARGE : 0
    const pfEDLICharge = pfApplies ? PF_EDLI_CHARGE : 0

    // Gross depends on benefits, and employer ESI depends on gross.
    // Iterate a few times to converge for this monthly CTC.
    let gross = basicRounded + hra + bonusAmount
    let esiEmployer = 0
    let totalBenefits = 0
    for (let i = 0; i < 12; i++) {
      const esicApplies = isESICApplicable(gross, state)
      esiEmployer = esicApplies ? Math.round(gross * ESI_EMPLOYER_RATE) : 0
      totalBenefits = pfEmployer + pfAdminCharge + pfEDLICharge + esiEmployer + employerLWF
      const newGross = monthlyCTC - totalBenefits
      if (Math.abs(newGross - gross) < 0.5) {
        gross = newGross
        break
      }
      gross = newGross
    }

    // Special Allowance is the balancing component so earnings sum to gross.
    // (Expected to be positive given basic is 50% of CTC.)
    const specialAllowance = Math.round(gross - (basicRounded + hra + bonusAmount))
    const grossTotalEarnings = basicRounded + hra + specialAllowance + bonusAmount

    // Employee deductions calculated against final gross (and ESI applicability based on gross).
    const esicAppliesFinal = isESICApplicable(grossTotalEarnings, state)
    const esiEmployee = esicAppliesFinal ? Math.round(basicRounded * ESI_EMPLOYEE_RATE) : 0
    const professionalTax = calculateProfessionalTax(grossTotalEarnings, state, month)
    const medicclaimDeduction = 0
    const totalDeductions = pfEmployee + esiEmployee + professionalTax + employeeLWF + medicclaimDeduction
    const finalNetSalary = grossTotalEarnings - totalDeductions

    return {
      basic: basicRounded,
      hra,
      specialAllowance,
      bonusAmount,
      grossTotalEarnings,
      pfEmployee,
      esiEmployee,
      professionalTax,
      medicclaimDeduction,
      totalDeductions,
      netSalary: Math.round(finalNetSalary),
      pfEmployer,
      pfAdminCharge,
      pfEDLICharge,
      esiEmployer,
      totalBenefits,
      monthlyCTC,
    }
  }

  // Solve monthly CTC so that net salary matches target.
  let monthlyCTC = Math.max(netSalary * 1.7, 15000)
  let best = computeFromMonthlyCTC(monthlyCTC)

  for (let iter = 0; iter < 40; iter++) {
    const diff = netSalary - best.netSalary
    if (Math.abs(diff) <= tolerance) break

    const delta = Math.max(100, monthlyCTC * 0.01)
    const up = computeFromMonthlyCTC(monthlyCTC + delta)
    const slope = (up.netSalary - best.netSalary) / delta

    // If slope is bad (should be >0), fallback to conservative step.
    const step = slope > 0.0001 ? diff / slope : diff * 1.5
    monthlyCTC = Math.max(10000, monthlyCTC + step)
    best = computeFromMonthlyCTC(monthlyCTC)
  }

  const annualCTC = best.monthlyCTC * 12

  return {
    basic: best.basic,
    hra: best.hra,
    specialAllowance: best.specialAllowance,
    bonusAmount: best.bonusAmount,
    grossTotalEarnings: best.grossTotalEarnings,
    pfEmployee: best.pfEmployee,
    esiEmployee: best.esiEmployee,
    professionalTax: Math.round(best.professionalTax),
    // LWF can be fractional for some states (e.g., Delhi ₹2.25); preserve 2 decimals.
    employeeLWF: Math.round(employeeLWF * 100) / 100,
    medicclaimDeduction: Math.round(best.medicclaimDeduction),
    totalDeductions: Math.round(best.totalDeductions),
    netSalary: Math.round(best.netSalary),
    variableIncentive: 0,
    pfEmployer: best.pfEmployer,
    pfAdminCharge: best.pfAdminCharge,
    pfEDLICharge: best.pfEDLICharge,
    esiEmployer: Math.round(best.esiEmployer),
    employerLWF: Math.round(employerLWF * 100) / 100,
    totalBenefits: Math.round(best.totalBenefits),
    ctc: Math.round(annualCTC),
    travelAllowance: undefined, // Only set if provided by user
  }
}
