import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Professional Tax data from https://saral.pro/blogs/professional-tax-slab-rates-in-different-states/
// This is a function-based mapping since Professional Tax is based on salary slabs
const PROFESSIONAL_TAX_SLABS = {
  'Andhra Pradesh': (gross) => {
    if (gross <= 15000) return 0;
    if (gross <= 20000) return 150;
    return 200;
  },
  'Telangana': (gross) => {
    if (gross <= 15000) return 0;
    if (gross <= 20000) return 150;
    return 200;
  },
  'Assam': (gross) => {
    if (gross <= 15000) return 0;
    if (gross <= 25000) return 180;
    return 208;
  },
  'Bihar': (gross) => {
    if (gross <= 300000) return 0;
    if (gross <= 500000) return 1000;
    if (gross <= 1000000) return 2000;
    return 2500;
  },
  'Delhi': (gross) => {
    if (gross <= 50000) return 0;
    if (gross <= 75000) return 100;
    if (gross <= 100000) return 150;
    return 200;
  },
  'Goa': (gross) => {
    if (gross <= 15000) return 0;
    if (gross <= 25000) return 150;
    return 200;
  },
  'Gujarat': (gross) => {
    if (gross < 12000) return 0;
    return 200;
  },
  'Jharkhand': (gross) => {
    if (gross <= 300000) return 0;
    if (gross <= 500000) return 1200;
    if (gross <= 800000) return 1800;
    if (gross <= 1000000) return 2100;
    return 2500;
  },
  'Karnataka': (gross) => {
    if (gross < 25000) return 0;
    // Note: February is ₹300, other months ₹200
    return 200;
  },
  'Kerala': (gross) => {
    // Half-yearly calculation - convert to monthly
    const halfYearly = gross * 6;
    if (halfYearly <= 11999) return 0;
    if (halfYearly <= 17999) return Math.round(320 / 6);
    if (halfYearly <= 29999) return Math.round(450 / 6);
    if (halfYearly <= 44999) return Math.round(600 / 6);
    if (halfYearly <= 99999) return Math.round(750 / 6);
    if (halfYearly <= 124999) return Math.round(1000 / 6);
    if (halfYearly <= 200000) return Math.round(1250 / 6);
    return Math.round(1250 / 6);
  },
  'Madhya Pradesh': (gross) => {
    if (gross <= 225000) return 0;
    // 11 months: ₹208, last month: ₹212
    return 208;
  },
  'Maharashtra': (gross) => {
    if (gross <= 5000) return 0;
    if (gross <= 10000) return 175;
    return 200;
  },
  'Manipur': (gross) => {
    if (gross <= 3000) return 0;
    if (gross <= 5000) return 150;
    if (gross <= 10000) return 200;
    return 250;
  },
  'Meghalaya': (gross) => {
    if (gross <= 10000) return 0;
    if (gross <= 15000) return 200;
    return 250;
  },
  'Odisha': (gross) => {
    if (gross <= 10000) return 0;
    if (gross <= 15000) return 150;
    if (gross <= 20000) return 200;
    return 250;
  },
  'Punjab': (gross) => {
    if (gross <= 250000) return 0;
    return 200;
  },
  'Puducherry': (gross) => {
    // Half-yearly calculation
    const halfYearly = gross * 6;
    if (halfYearly <= 99999) return 0;
    if (halfYearly <= 200000) return Math.round(250 / 6);
    if (halfYearly <= 300000) return Math.round(500 / 6);
    if (halfYearly <= 400000) return Math.round(750 / 6);
    if (halfYearly <= 500000) return Math.round(1000 / 6);
    return Math.round(1250 / 6);
  },
  'Sikkim': (gross) => {
    if (gross <= 20000) return 0;
    if (gross <= 30000) return 125;
    if (gross <= 40000) return 150;
    return 200;
  },
  'Tamil Nadu': (gross) => {
    // Half-yearly calculation
    const halfYearly = gross * 6;
    if (halfYearly <= 21000) return 0;
    if (halfYearly <= 30000) return Math.round(180 / 6);
    if (halfYearly <= 45000) return Math.round(425 / 6);
    if (halfYearly <= 60000) return Math.round(930 / 6);
    if (halfYearly <= 75000) return Math.round(1025 / 6);
    if (halfYearly <= 1000000) return Math.round(1250 / 6);
    return Math.round(1250 / 6);
  },
  'Tripura': (gross) => {
    if (gross <= 7500) return 0;
    if (gross <= 15000) return 150;
    return 208;
  },
  'West Bengal': (gross) => {
    if (gross <= 10000) return 0;
    if (gross <= 15000) return 110;
    if (gross <= 25000) return 130;
    if (gross <= 40000) return 150;
    return 200;
  },
};

// For states not listed, use a default function
const getDefaultProfessionalTax = (gross) => {
  // Most states have similar patterns, default to 200 for higher salaries
  if (gross <= 15000) return 0;
  return 200;
};

// LWF data - will be extracted from PDF
// Placeholder structure
const LWF_BY_STATE = {
  'Maharashtra': { employee: 25, employer: 50 },
  'Karnataka': { employee: 10, employer: 20 },
  'Gujarat': { employee: 10, employer: 20 },
  // Will be populated from PDF
};

// ESIC data - will be extracted from PDF
// ESIC is typically based on gross salary threshold (21000)
const ESIC_APPLICABILITY = {
  // Most states: ESIC applies if gross < 21000
  // Some states may have different rules
};

console.log('Professional Tax Slabs:', JSON.stringify(PROFESSIONAL_TAX_SLABS, null, 2));
console.log('\nLWF Data:', JSON.stringify(LWF_BY_STATE, null, 2));
console.log('\nESIC Applicability:', JSON.stringify(ESIC_APPLICABILITY, null, 2));

// Export for use in main code
export { PROFESSIONAL_TAX_SLABS, LWF_BY_STATE, ESIC_APPLICABILITY, getDefaultProfessionalTax };
