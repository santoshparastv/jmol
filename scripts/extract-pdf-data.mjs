import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Since pdf-parse might have issues, we'll create a manual extraction script
// The user can run this and manually verify/update the data

console.log('PDF Data Extraction Script');
console.log('==========================\n');
console.log('Please manually extract data from:');
console.log('1. LWF.pdf - Labour Welfare Fund state-wise rates');
console.log('2. ESIC State Wise.pdf - ESIC applicability by state\n');

// Professional Tax data extracted from https://saral.pro/blogs/professional-tax-slab-rates-in-different-states/
const professionalTaxData = {
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
      { max: Infinity, amount: 200 } // Note: February is ₹300
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
      { max: Infinity, amount: 208 } // 11 months: ₹208, last month: ₹212
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
};

// Write to a JSON file
const outputPath = path.join(__dirname, '..', 'lib', 'state-tax-data.json');
fs.writeFileSync(outputPath, JSON.stringify({
  professionalTax: professionalTaxData,
  lwf: {}, // To be filled from PDF
  esic: {} // To be filled from PDF
}, null, 2));

console.log(`\nProfessional Tax data written to: ${outputPath}`);
console.log('\nNext steps:');
console.log('1. Manually extract LWF data from LWF.pdf');
console.log('2. Manually extract ESIC data from ESIC State Wise.pdf');
console.log('3. Update the JSON file with the extracted data');
