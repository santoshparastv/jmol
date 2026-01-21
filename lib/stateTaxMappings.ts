/**
 * State-wise tax mappings for Professional Tax, LWF, and ESIC
 * 
 * Professional Tax data source: https://saral.pro/blogs/professional-tax-slab-rates-in-different-states/
 * LWF data source: LWF.pdf (to be extracted)
 * ESIC data source: ESIC State Wise.pdf (to be extracted)
 */

export interface ProfessionalTaxSlab {
  max: number
  amount: number
}

export interface ProfessionalTaxConfig {
  type: 'slab' | 'half-yearly'
  slabs: ProfessionalTaxSlab[]
  note?: string
}

export interface LWFConfig {
  employee: number
  employer: number
  /**
   * Contribution frequency as per LWF.docx / LWF.pdf table.
   * Note: deductions are typically collected only in specific months (e.g., Jun/Dec).
   */
  frequency?: 'monthly' | 'half-yearly' | 'yearly'
  /**
   * Months (1-12) in which the deduction is applied for non-monthly frequencies.
   * If omitted, defaults to [6,12] for half-yearly and [12] for yearly.
   */
  deductionMonths?: number[]
}

export interface ESICConfig {
  applicable: boolean
  threshold?: number // Gross salary threshold (default: 21000)
}

/**
 * Calculate Professional Tax based on gross salary and state
 */
export function calculateProfessionalTax(grossSalary: number, state: string, month?: number): number {
  const config = PROFESSIONAL_TAX_BY_STATE[state]
  if (!config) {
    // Default: most states use 200 for higher salaries
    return grossSalary <= 15000 ? 0 : 200
  }

  if (config.type === 'half-yearly') {
    const halfYearly = grossSalary * 6
    for (const slab of config.slabs) {
      if (halfYearly <= slab.max) {
        return Math.round(slab.amount / 6)
      }
    }
    return Math.round(config.slabs[config.slabs.length - 1].amount / 6)
  }

  // Handle special cases
  if (state === 'Karnataka' && month === 2) {
    // February is ₹300
    return grossSalary < 25000 ? 0 : 300
  }

  if (state === 'Madhya Pradesh' && month === 12) {
    // Last month is ₹212
    return grossSalary <= 225000 ? 0 : 212
  }

  // Regular slab calculation
  for (const slab of config.slabs) {
    if (grossSalary <= slab.max) {
      return slab.amount
    }
  }

  return config.slabs[config.slabs.length - 1].amount
}

/**
 * Get LWF (Labour Welfare Fund) rates for a state
 */
export function getLWF(state: string): LWFConfig {
  return LWF_BY_STATE[state] || { employee: 0, employer: 0, frequency: 'monthly' }
}

/**
 * Get LWF (Labour Welfare Fund) rates for a state for a specific month.
 * This prevents half-yearly/yearly deductions from being incorrectly spread or rounded away.
 */
export function getLWFForMonth(state: string, month: number = 12): LWFConfig {
  const config = getLWF(state)

  const frequency = config.frequency || 'monthly'
  if (frequency === 'monthly') return config

  const months =
    config.deductionMonths ||
    (frequency === 'half-yearly' ? [6, 12] : [12])

  if (!months.includes(month)) {
    return { ...config, employee: 0, employer: 0 }
  }

  return config
}

/**
 * Check if ESIC is applicable for a state and gross salary
 */
export function isESICApplicable(grossSalary: number, state: string): boolean {
  const config = ESIC_BY_STATE[state]
  if (!config) {
    // Default: ESIC applies if gross < 21000
    return grossSalary < 21000
  }
  
  if (!config.applicable) return false
  
  const threshold = config.threshold || 21000
  return grossSalary < threshold
}

// Professional Tax configurations by state
const PROFESSIONAL_TAX_BY_STATE: Record<string, ProfessionalTaxConfig> = {
  'Andhra Pradesh': {
    type: 'slab',
    slabs: [
      { max: 15000, amount: 0 },
      { max: 20000, amount: 150 },
      { max: Infinity, amount: 200 }
    ]
  },
  'Telangana': {
    type: 'slab',
    slabs: [
      { max: 15000, amount: 0 },
      { max: 20000, amount: 150 },
      { max: Infinity, amount: 200 }
    ]
  },
  'Assam': {
    type: 'slab',
    slabs: [
      { max: 15000, amount: 0 },
      { max: 25000, amount: 180 },
      { max: Infinity, amount: 208 }
    ]
  },
  'Bihar': {
    type: 'slab',
    slabs: [
      { max: 300000, amount: 0 },
      { max: 500000, amount: 1000 },
      { max: 1000000, amount: 2000 },
      { max: Infinity, amount: 2500 }
    ]
  },
  'Delhi': {
    type: 'slab',
    slabs: [
      { max: 50000, amount: 0 },
      { max: 75000, amount: 100 },
      { max: 100000, amount: 150 },
      { max: Infinity, amount: 200 }
    ]
  },
  'Goa': {
    type: 'slab',
    slabs: [
      { max: 15000, amount: 0 },
      { max: 25000, amount: 150 },
      { max: Infinity, amount: 200 }
    ]
  },
  'Gujarat': {
    type: 'slab',
    slabs: [
      { max: 12000, amount: 0 },
      { max: Infinity, amount: 200 }
    ]
  },
  'Jharkhand': {
    type: 'slab',
    slabs: [
      { max: 300000, amount: 0 },
      { max: 500000, amount: 1200 },
      { max: 800000, amount: 1800 },
      { max: 1000000, amount: 2100 },
      { max: Infinity, amount: 2500 }
    ]
  },
  'Karnataka': {
    type: 'slab',
    slabs: [
      { max: 25000, amount: 0 },
      { max: Infinity, amount: 200 }
    ],
    note: 'February: ₹300, Other months: ₹200'
  },
  'Kerala': {
    type: 'half-yearly',
    slabs: [
      { max: 11999, amount: 0 },
      { max: 17999, amount: 320 },
      { max: 29999, amount: 450 },
      { max: 44999, amount: 600 },
      { max: 99999, amount: 750 },
      { max: 124999, amount: 1000 },
      { max: 200000, amount: 1250 },
      { max: Infinity, amount: 1250 }
    ]
  },
  'Madhya Pradesh': {
    type: 'slab',
    slabs: [
      { max: 225000, amount: 0 },
      { max: Infinity, amount: 208 }
    ],
    note: '11 months: ₹208, Last month: ₹212'
  },
  'Maharashtra': {
    type: 'slab',
    slabs: [
      { max: 5000, amount: 0 },
      { max: 10000, amount: 175 },
      { max: Infinity, amount: 200 }
    ]
  },
  'Manipur': {
    type: 'slab',
    slabs: [
      { max: 3000, amount: 0 },
      { max: 5000, amount: 150 },
      { max: 10000, amount: 200 },
      { max: Infinity, amount: 250 }
    ]
  },
  'Meghalaya': {
    type: 'slab',
    slabs: [
      { max: 10000, amount: 0 },
      { max: 15000, amount: 200 },
      { max: Infinity, amount: 250 }
    ]
  },
  'Odisha': {
    type: 'slab',
    slabs: [
      { max: 10000, amount: 0 },
      { max: 15000, amount: 150 },
      { max: 20000, amount: 200 },
      { max: Infinity, amount: 250 }
    ]
  },
  'Punjab': {
    type: 'slab',
    slabs: [
      { max: 250000, amount: 0 },
      { max: Infinity, amount: 200 }
    ]
  },
  'Puducherry': {
    type: 'half-yearly',
    slabs: [
      { max: 99999, amount: 0 },
      { max: 200000, amount: 250 },
      { max: 300000, amount: 500 },
      { max: 400000, amount: 750 },
      { max: 500000, amount: 1000 },
      { max: Infinity, amount: 1250 }
    ]
  },
  'Sikkim': {
    type: 'slab',
    slabs: [
      { max: 20000, amount: 0 },
      { max: 30000, amount: 125 },
      { max: 40000, amount: 150 },
      { max: Infinity, amount: 200 }
    ]
  },
  'Tamil Nadu': {
    type: 'half-yearly',
    slabs: [
      { max: 21000, amount: 0 },
      { max: 30000, amount: 180 },
      { max: 45000, amount: 425 },
      { max: 60000, amount: 930 },
      { max: 75000, amount: 1025 },
      { max: 1000000, amount: 1250 },
      { max: Infinity, amount: 1250 }
    ]
  },
  'Tripura': {
    type: 'slab',
    slabs: [
      { max: 7500, amount: 0 },
      { max: 15000, amount: 150 },
      { max: Infinity, amount: 208 }
    ]
  },
  'West Bengal': {
    type: 'slab',
    slabs: [
      { max: 10000, amount: 0 },
      { max: 15000, amount: 110 },
      { max: 25000, amount: 130 },
      { max: 40000, amount: 150 },
      { max: Infinity, amount: 200 }
    ]
  }
}

// LWF (Labour Welfare Fund) by state
// Source: Updated from user-provided data table
// Notes:
// - All LWF deductions are now monthly (no half-yearly/yearly frequencies).
// - Employer LWF values are as specified (not always 2X of employee).
const LWF_BY_STATE: Record<string, LWFConfig> = {
  'Andhra Pradesh': { employee: 30, employer: 70, frequency: 'monthly' },
  'Chandigarh': { employee: 20, employer: 80, frequency: 'monthly' },
  'Chhattisgarh': { employee: 25, employer: 75, frequency: 'monthly' },
  'Delhi': { employee: 25, employer: 75, frequency: 'monthly' },
  'Goa': { employee: 60, employer: 180, frequency: 'monthly' },
  'Gujarat': { employee: 25, employer: 50, frequency: 'monthly' },
  'Haryana': { employee: 34, employer: 68, frequency: 'monthly' },
  'Karnataka': { employee: 20, employer: 40, frequency: 'monthly' },
  'Kerala': { employee: 50, employer: 50, frequency: 'monthly' },
  'Madhya Pradesh': { employee: 30, employer: 60, frequency: 'monthly' },
  'Maharashtra': { employee: 25, employer: 75, frequency: 'monthly' },
  'Odisha': { employee: 25, employer: 50, frequency: 'monthly' },
  'Punjab': { employee: 25, employer: 20, frequency: 'monthly' },
  'Tamil Nadu': { employee: 20, employer: 40, frequency: 'monthly' },
  'Telangana': { employee: 20, employer: 40, frequency: 'monthly' },
  'West Bengal': { employee: 20, employer: 40, frequency: 'monthly' },
}

// ESIC applicability by state
// Source: extracted from `ESIC State Wise.docx` / `ESIC State Wise.pdf` (district notification coverage)
// Default: ESIC applies if gross salary < 21000
const ESIC_BY_STATE: Record<string, ESICConfig> = {
  'Andhra Pradesh': { applicable: true, threshold: 21000 },
  'Arunachal Pradesh': { applicable: false, threshold: 21000 },
  'Assam': { applicable: true, threshold: 21000 },
  'Bihar': { applicable: true, threshold: 21000 },
  'Chandigarh': { applicable: true, threshold: 21000 },
  'Chhattisgarh': { applicable: true, threshold: 21000 },
  'Delhi': { applicable: true, threshold: 21000 },
  'Goa': { applicable: true, threshold: 21000 },
  'Gujarat': { applicable: true, threshold: 21000 },
  'Haryana': { applicable: true, threshold: 21000 },
  'Himachal Pradesh': { applicable: true, threshold: 21000 },
  'Jharkhand': { applicable: true, threshold: 21000 },
  'Karnataka': { applicable: true, threshold: 21000 },
  'Kerala': { applicable: true, threshold: 21000 },
  'Madhya Pradesh': { applicable: true, threshold: 21000 },
  'Maharashtra': { applicable: true, threshold: 21000 },
  'Manipur': { applicable: false, threshold: 21000 },
  'Meghalaya': { applicable: false, threshold: 21000 },
  'Mizoram': { applicable: false, threshold: 21000 },
  'Nagaland': { applicable: false, threshold: 21000 },
  'Odisha': { applicable: true, threshold: 21000 },
  'Puducherry': { applicable: false, threshold: 21000 },
  'Punjab': { applicable: true, threshold: 21000 },
  'Rajasthan': { applicable: true, threshold: 21000 },
  'Sikkim': { applicable: false, threshold: 21000 },
  'Tamil Nadu': { applicable: true, threshold: 21000 },
  'Telangana': { applicable: true, threshold: 21000 },
  'Tripura': { applicable: false, threshold: 21000 },
  'Uttar Pradesh': { applicable: true, threshold: 21000 },
  'Uttarakhand': { applicable: true, threshold: 21000 },
  'West Bengal': { applicable: true, threshold: 21000 },
}

export { PROFESSIONAL_TAX_BY_STATE, LWF_BY_STATE, ESIC_BY_STATE }
