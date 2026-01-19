// Salary calculation based on formulas from Google Sheets "CTC Auto Calculator"
// Formulas extracted from: https://docs.google.com/spreadsheets/d/1kwDlSYN2maubVvT8ccZZ9skqHkgis8cdJBTUvCQjQlc

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

// Professional Tax by state (monthly, fixed) - Updated with actual state-wise rates
const PROFESSIONAL_TAX_BY_STATE: Record<string, number> = {
  'Maharashtra': 200,
  'Karnataka': 200,
  'West Bengal': 200,
  'Gujarat': 200,
  'Tamil Nadu': 200,
  'Kerala': 200,
  'Andhra Pradesh': 200,
  'Telangana': 200,
  'Delhi': 0, // No Professional Tax in Delhi
  'Haryana': 200,
  'Punjab': 200,
  'Rajasthan': 200,
  'Uttar Pradesh': 200,
  'Madhya Pradesh': 200,
  'Bihar': 200,
  'Odisha': 200,
  'Assam': 200,
  'Jharkhand': 200,
  'Chhattisgarh': 200,
  'Uttarakhand': 200,
  'Himachal Pradesh': 200,
  'Goa': 200,
  'Puducherry': 200,
  'Manipur': 200,
  'Meghalaya': 200,
  'Mizoram': 200,
  'Nagaland': 200,
  'Tripura': 200,
  'Arunachal Pradesh': 200,
  'Sikkim': 200,
}

// LWF (Labour Welfare Fund) by state (monthly, employee contribution)
// Employer typically pays 2x employee contribution
const LWF_BY_STATE: Record<string, number> = {
  'Maharashtra': 25, // Employee: 25, Employer: 50
  'Karnataka': 10,  // Employee: 10, Employer: 20
  'Gujarat': 10,    // Employee: 10, Employer: 20
  'Delhi': 0,       // No LWF in Delhi
  'Haryana': 0,     // No LWF in Haryana
  'West Bengal': 0,
  'Tamil Nadu': 0,
  'Kerala': 0,
  'Andhra Pradesh': 0,
  'Telangana': 0,
  'Punjab': 0,
  'Rajasthan': 0,
  'Uttar Pradesh': 0,
  'Madhya Pradesh': 0,
  'Bihar': 0,
  'Odisha': 0,
  'Assam': 0,
  'Jharkhand': 0,
  'Chhattisgarh': 0,
  'Uttarakhand': 0,
  'Himachal Pradesh': 0,
  'Goa': 0,
  'Puducherry': 0,
  'Manipur': 0,
  'Meghalaya': 0,
  'Mizoram': 0,
  'Nagaland': 0,
  'Tripura': 0,
  'Arunachal Pradesh': 0,
  'Sikkim': 0,
}

// PF Admin Charge and EDLI Charge (fixed values)
const PF_ADMIN_CHARGE = 55
const PF_EDLI_CHARGE = 55

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
  pfEnabled: boolean = true
): SalaryBreakdown {
  // Get state-specific values
  const professionalTax = PROFESSIONAL_TAX_BY_STATE[state] || 200
  const employeeLWF = LWF_BY_STATE[state] || 0
  const employerLWF = employeeLWF * 2 // Typically employer pays 2x employee LWF
  
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
    const hra = Math.round(basic * 0.40)
    
    // Bonus Amount - from sheet example: 1200 is ~8.89% of 13500
    // Using 8.89% to match the sheet example
    const bonusAmount = Math.round(basic * 0.0889)
    
    // Gross Total Earnings = SUM(Basic, HRA, Bonus) - from sheet: =SUM(B2:B4)
    const grossTotalEarnings = basic + hra + bonusAmount
    
    // Employee PF = 12% of Basic - from sheet: =B2/100*12
    // PF is mandatory if basic <= 15000, otherwise based on pfEnabled flag
    // No cap (per requirement / sheet style formula)
    const pfEmployee = (pfEnabled || basic <= 15000) 
      ? Math.round(basic * 0.12) 
      : 0
    
    // Employee ESI = 0.75% of Basic - from sheet: =B2/100*0.75
    // Note: Sheet shows ESI calculated on Basic (B2), not Gross (unusual but matching sheet)
    // ESI is only if Gross < 21000 (from notes: "Up 21k Gross Salary ESIC is mandatory")
    const esiEmployee = grossTotalEarnings < 21000 
      ? Math.round(basic * 0.0075) 
      : 0
    
    // Professional Tax (fixed by state) - from sheet: 200
    // Employee LWF (fixed by state) - from sheet: 25
    // Mediclaim Deduction - from sheet: 0
    
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
  const hra = Math.round(basic * 0.40)
  const bonusAmount = Math.round(basic * 0.089)
  const grossTotalEarnings = basic + hra + bonusAmount
  
  // Employee deductions
  // PF is mandatory if basic <= 15000, otherwise based on pfEnabled flag
  const pfEmployee = (pfEnabled || basic <= 15000) 
    ? Math.round(basic * 0.12) 
    : 0
  const esiEmployee = grossTotalEarnings < 21000 
    ? Math.round(basic * 0.0075) 
    : 0
  const medicclaimDeduction = 0
  const totalDeductions = pfEmployee + esiEmployee + professionalTax + employeeLWF + medicclaimDeduction
  const finalNetSalary = grossTotalEarnings - totalDeductions
  
  // Employer contributions
  // PF employer contribution only if PF is enabled
  const pfEmployer = (pfEnabled || basic <= 15000) 
    ? Math.round(basic * 0.12) 
    : 0
  const pfAdminCharge = (pfEnabled || basic <= 15000) ? PF_ADMIN_CHARGE : 0 // Fixed: 55
  const pfEDLICharge = (pfEnabled || basic <= 15000) ? PF_EDLI_CHARGE : 0 // Fixed: 55
  
  // Employer ESI = 3.25% of Gross (from sheet: =B5/100*3.25)
  const esiEmployer = grossTotalEarnings < 21000 
    ? Math.round(grossTotalEarnings * 0.0325) 
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
    employeeLWF: Math.round(employeeLWF),
    medicclaimDeduction: Math.round(medicclaimDeduction),
    totalDeductions: Math.round(totalDeductions),
    netSalary: Math.round(finalNetSalary),
    variableIncentive: 0,
    pfEmployer: Math.round(pfEmployer),
    pfAdminCharge: Math.round(pfAdminCharge),
    pfEDLICharge: Math.round(pfEDLICharge),
    esiEmployer: Math.round(esiEmployer),
    employerLWF: Math.round(employerLWF),
    totalBenefits: Math.round(totalBenefits),
    ctc: Math.round(annualCTC),
    travelAllowance: undefined, // Only set if provided by user
  }
}
