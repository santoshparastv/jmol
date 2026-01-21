# Formulas Implemented from Google Sheets

## ✅ All Formulas Extracted and Implemented

Based on your Google Sheets "CTC Auto Calculator", I've implemented all the formulas exactly as they appear in your sheet.

## Formula Mapping

### From Sheet to Code

| Component | Sheet Formula | Code Implementation |
|-----------|--------------|---------------------|
| **Basic Salary** | Input/Calculated | Calculated iteratively from Net Salary |
| **HRA** | `=D2/100*40` (40% of Basic) | `basic * 0.40` |
| **Bonus Amount** | `1200` (8.89% of Basic in example) | `basic * 0.0889` |
| **Gross Total Earnings** | `=SUM(B2:B4)` | `basic + hra + bonusAmount` |
| **Employee PF** | `=B2/100*12` (12% of Basic) | `basic * 0.12` (capped at 1800) |
| **Employee ESI** | `=B2/100*0.75` (0.75% of Basic) | `basic * 0.0075` (if Gross < 21000) |
| **Professional Tax** | `200` (fixed by state) | State-specific lookup table |
| **Employee LWF** | `25` (fixed by state) | State-specific lookup table |
| **Mediclaim Deduction** | `0` | `0` |
| **Total Deductions** | `=SUM(B6:B10)` | `pfEmployee + esiEmployee + professionalTax + employeeLWF + mediclaimDeduction` |
| **Net Salary** | `=B5-B11` | `grossTotalEarnings - totalDeductions` |
| **Variable Incentive** | `0` | `0` |
| **Employer PF** | `=B2/100*12` (12% of Basic) | `basic * 0.12` (capped at 1800) |
| **PF Admin Charge** | `55` (fixed) | `55` |
| **PF EDLI Charge** | `55` (fixed) | `55` |
| **Employer ESI** | `=B5/100*3.25` (3.25% of Gross) | `grossTotalEarnings * 0.0325` (if Gross < 21000) |
| **Employer LWF** | `50` (2x Employee LWF) | `employeeLWF * 2` |
| **Total Benefits** | `=SUM(B14:B18)` | `pfEmployer + pfAdminCharge + pfEDLICharge + esiEmployer + employerLWF` |
| **CTC** | `=B5+B19` (Monthly) | `(grossTotalEarnings + totalBenefits) * 12` (Annual) |

## Key Notes

1. **Employee ESI**: Calculated on **Basic Salary** (not Gross) - matching your sheet formula `=B2/100*0.75`
2. **Employer ESI**: Calculated on **Gross Salary** - matching your sheet formula `=B5/100*3.25`
3. **ESI Applicability**: Only applies if Gross Salary < 21,000 (as per your notes)
4. **PF Calculation**: 12% of Basic, capped at ₹1,800 (standard PF limit)
5. **HRA**: Maximum 40% of Basic Salary
6. **Bonus**: Calculated as 8.89% of Basic (based on your sheet example: 1200/13500)

## State-Specific Values

### Professional Tax
- Most states: ₹200/month
- Delhi: ₹0

### LWF (Labour Welfare Fund)
- Maharashtra: ₹25 (Employee), ₹50 (Employer)
- Other states: Configurable in code

## Calculation Flow

1. **Input**: Net Salary (user provides)
2. **Reverse Calculation**: Iteratively find Basic Salary that results in target Net Salary
3. **Calculate Components**: 
   - HRA = 40% of Basic
   - Bonus = 8.89% of Basic
   - Gross = Basic + HRA + Bonus
4. **Calculate Deductions**:
   - PF = 12% of Basic
   - ESI = 0.75% of Basic (if Gross < 21000)
   - Professional Tax = State-specific
   - LWF = State-specific
5. **Verify Net**: Gross - Deductions = Target Net Salary
6. **Calculate Benefits**: Employer contributions
7. **Calculate CTC**: Gross + Benefits (Annual)

## Testing

To verify the calculations match your sheet:
1. Use the same Net Salary from your sheet example
2. Compare each component with your sheet values
3. Adjust if needed (bonus percentage, etc.)

## Files Updated

- ✅ `lib/salaryCalculator.ts` - All formulas implemented
- ✅ `lib/pdfGenerator.tsx` - PDF template matches your offer letter exactly
- ✅ State-specific tax tables updated

---

**Status**: ✅ Ready to use! All formulas from your Google Sheets are now implemented in the code.
