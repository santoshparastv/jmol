// Salary calculation based on formulas from Google Sheets "CTC Auto Calculator"
// Formulas extracted from: https://docs.google.com/spreadsheets/d/1kwDlSYN2maubVvT8ccZZ9skqHkgis8cdJBTUvCQjQlc

import { calculateProfessionalTax, getLWFForMonth, isESICApplicable } from './stateTaxMappings'

export interface SalaryBreakdown {
  basic: number
  hra: number
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
 * - Employee PF: 12% of Basic (sheet shows =B2/100*12; no cap)
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
  
  // Reverse calculation: We need to find Basic Salary that results in target Net Salary
  // Using iterative approach to find the correct Basic Salary
  
  let basic = 10000 // Start with initial guess
  let calculatedNet = 0
  let iterations = 0
  const maxIterations = 100
  const tolerance = 1 // Acceptable difference in rupees
  
  while (Math.abs(calculatedNet - netSalary) > tolerance && iterations < maxIterations) {
    // Calculate components based on Basic (matching sheet formulas exactly)
    // HRA = 40% of Basic (from sheet: =D2/100*40, Maximum 40% of Basic Salary)
    const hra = Math.round(basic * HRA_RATE)
    
    // Bonus Amount - from sheet example: 1200 is ~8.89% of 13500
    // Using 8.89% to match the sheet example
    const bonusAmount = Math.round(basic * BONUS_RATE)
    
    // Gross Total Earnings = SUM(Basic, HRA, Bonus) - from sheet: =SUM(B2:B4)
    const grossTotalEarnings = basic + hra + bonusAmount
    
    // Employee PF = 12% of Basic - from sheet: =B2/100*12
    // PF is mandatory if basic <= 15000, otherwise based on pfEnabled flag
    // No cap (per requirement / sheet style formula)
    const pfEmployee = (pfEnabled || (enforcePfMandatory && basic <= 15000)) 
      ? Math.round(basic * PF_RATE) 
      : 0
    
    // Employee ESI = 0.75% of Basic - from sheet: =B2/100*0.75
    // Note: Sheet shows ESI calculated on Basic (B2), not Gross (unusual but matching sheet)
    // ESI is only if Gross < 21000 (from notes: "Up 21k Gross Salary ESIC is mandatory")
    // Use state-wise ESIC applicability check
    const esiEmployee = isESICApplicable(grossTotalEarnings, state)
      ? Math.round(basic * ESI_EMPLOYEE_RATE) 
      : 0
    
    // Professional Tax (calculated based on gross salary and state slabs)
    // Employee LWF (fixed by state)
    // Mediclaim Deduction - from sheet: 0
    
    // Calculate professional tax based on gross salary
    const professionalTax = calculateProfessionalTax(grossTotalEarnings, state, month)
    
    // Total Deductions = SUM(PF, ESI, PT, LWF, Mediclaim) - from sheet: =SUM(B6:B10)
    const totalDeductions = pfEmployee + esiEmployee + professionalTax + employeeLWF + 0
    
    // Net Salary = Gross - Deductions - from sheet: =B5-B11
    calculatedNet = grossTotalEarnings - totalDeductions
    
    // Adjust Basic to get closer to target Net Salary
    // Use a more precise adjustment factor
    const difference = netSalary - calculatedNet
    if (Math.abs(difference) > tolerance) {
      // Estimate how much Basic needs to change
      // Gross changes by ~1.489x Basic (1 + 0.40 + 0.0889)
      // Deductions change by ~0.1275x Basic (0.12 + 0.0075 if ESI applies)
      // Net changes by ~1.3615x Basic
      const basicAdjustment = difference / 1.3615
      basic += basicAdjustment
    }
    
    // Ensure Basic doesn't go negative or too low
    basic = Math.max(basic, 5000)
    
    iterations++
  }
  
  // Final calculations with the found Basic Salary
  const hra = Math.round(basic * HRA_RATE)
  const bonusAmount = Math.round(basic * BONUS_RATE)
  const grossTotalEarnings = basic + hra + bonusAmount
  
  // Employee deductions
  // PF is mandatory if basic <= 15000, otherwise based on pfEnabled flag
  const pfEmployee = (pfEnabled || (enforcePfMandatory && basic <= 15000)) 
    ? Math.round(basic * PF_RATE) 
    : 0
  const esiEmployee = isESICApplicable(grossTotalEarnings, state)
    ? Math.round(basic * ESI_EMPLOYEE_RATE) 
    : 0
  const medicclaimDeduction = 0
  
  // Calculate professional tax based on final gross salary
  const professionalTax = calculateProfessionalTax(grossTotalEarnings, state, month)
  
  const totalDeductions = pfEmployee + esiEmployee + professionalTax + employeeLWF + medicclaimDeduction
  const finalNetSalary = grossTotalEarnings - totalDeductions
  
  // Employer contributions
  // PF employer contribution only if PF is enabled
  const pfEmployer = (pfEnabled || (enforcePfMandatory && basic <= 15000)) 
    ? Math.round(basic * PF_RATE) 
    : 0
  const pfAdminCharge = (pfEnabled || (enforcePfMandatory && basic <= 15000)) ? PF_ADMIN_CHARGE : 0 // Fixed: 55
  const pfEDLICharge = (pfEnabled || (enforcePfMandatory && basic <= 15000)) ? PF_EDLI_CHARGE : 0 // Fixed: 55
  
  // Employer ESI = 3.25% of Gross (from sheet: =B5/100*3.25)
  const esiEmployer = isESICApplicable(grossTotalEarnings, state)
    ? Math.round(grossTotalEarnings * ESI_EMPLOYER_RATE) 
    : 0
  
  const totalBenefits = pfEmployer + pfAdminCharge + pfEDLICharge + esiEmployer + employerLWF
  
  // CTC = Gross + Benefits (Annual)
  const monthlyCTC = grossTotalEarnings + totalBenefits
  const annualCTC = monthlyCTC * 12
  
  return {
    basic: Math.round(basic),
    hra: Math.round(hra),
    bonusAmount: Math.round(bonusAmount),
    grossTotalEarnings: Math.round(grossTotalEarnings),
    pfEmployee: Math.round(pfEmployee),
    esiEmployee: Math.round(esiEmployee),
    professionalTax: Math.round(professionalTax),
    // LWF can be fractional for some states (e.g., Delhi ₹2.25); preserve 2 decimals.
    employeeLWF: Math.round(employeeLWF * 100) / 100,
    medicclaimDeduction: Math.round(medicclaimDeduction),
    totalDeductions: Math.round(totalDeductions),
    netSalary: Math.round(finalNetSalary),
    variableIncentive: 0,
    pfEmployer: Math.round(pfEmployer),
    pfAdminCharge: Math.round(pfAdminCharge),
    pfEDLICharge: Math.round(pfEDLICharge),
    esiEmployer: Math.round(esiEmployer),
    employerLWF: Math.round(employerLWF * 100) / 100,
    totalBenefits: Math.round(totalBenefits),
    ctc: Math.round(annualCTC),
    travelAllowance: undefined, // Only set if provided by user
  }
}
