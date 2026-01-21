# Extracting State-wise Tax Data from PDFs

This document explains how to extract LWF and ESIC data from the PDF files and update the code.

## Files to Extract From

1. **LWF.pdf** - Contains Labour Welfare Fund rates by state
2. **ESIC State Wise.pdf** - Contains ESIC applicability rules by state

## Professional Tax Data

Professional Tax data has already been extracted from:
https://saral.pro/blogs/professional-tax-slab-rates-in-different-states/

The data is stored in `lib/stateTaxMappings.ts` with slab-based calculations.

## Steps to Extract LWF Data

1. Open `LWF.pdf` in a PDF viewer
2. For each state, find:
   - Employee contribution (monthly)
   - Employer contribution (monthly)
3. Update `lib/stateTaxMappings.ts` in the `LWF_BY_STATE` object:

```typescript
'State Name': { employee: <amount>, employer: <amount> }
```

## Steps to Extract ESIC Data

1. Open `ESIC State Wise.pdf` in a PDF viewer
2. For each state, find:
   - Is ESIC applicable? (Yes/No)
   - Gross salary threshold (usually 21000, but may vary)
3. Update `lib/stateTaxMappings.ts` in the `ESIC_BY_STATE` object:

```typescript
'State Name': { applicable: true/false, threshold: <amount> }
```

## Current Status

- ✅ Professional Tax: Complete with slab-based calculations
- ⏳ LWF: Partially complete (Maharashtra, Karnataka, Gujarat only)
- ⏳ ESIC: Default values (21000 threshold for all states)

## Testing

After updating the data, test the salary calculator with different states and salary amounts to verify the calculations are correct.
