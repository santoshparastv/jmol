# Guide: How to Copy Formulas from Google Sheets to Your Code

This guide will help you extract the exact salary calculation formulas from your Google Sheets "CTC Auto Calculator" and implement them in the code.

## Step-by-Step Instructions

### Step 1: Open Your Google Sheets

1. Open the Google Sheets document: https://docs.google.com/spreadsheets/d/1kwDlSYN2maubVvT8ccZZ9skqHkgis8cdJBTUvCQjQlc/edit
2. Navigate to the **"CTC Auto Calculator"** sheet/tab

### Step 2: Identify the Calculation Cells

Look for cells that contain formulas (they will start with `=`). Common cells to check:

- **Net Salary** (this is your input)
- **Basic Salary**
- **HRA (House Rent Allowance)**
- **Bonus Amount**
- **Gross Total Earnings**
- **Employee PF**
- **Employee ESI**
- **Professional Tax**
- **Employee LWF**
- **Medicclaim Deduction**
- **Total Deductions**
- **Variable Incentive**
- **Employer PF**
- **PF Admin Charge**
- **PF EDLI Charge**
- **Employer ESI**
- **Employer LWF**
- **Total Benefits**
- **CTC (Cost to Company)**

### Step 3: View the Formulas

For each cell with a formula:

1. **Click on the cell** containing the formula
2. Look at the **formula bar** at the top of the sheet (it shows the formula)
3. **Copy the entire formula** (Ctrl+C or Cmd+C)

**Example:**
- If you see in the formula bar: `=IF(B2<21000, B2*0.0075, 0)` for ESI Employee
- Copy that entire formula

### Step 4: Document the Formulas

Create a document or spreadsheet listing:

| Component | Cell Reference | Formula | Notes |
|-----------|---------------|---------|-------|
| Basic Salary | (e.g., B5) | `=NetSalary*0.4` | 40% of net salary |
| HRA | (e.g., B6) | `=B5*0.5` | 50% of basic |
| ... | ... | ... | ... |

### Step 5: Identify State-Specific Rules

Check if there are:
- **Different formulas for different states**
- **Lookup tables** for state-specific values (like Professional Tax, LWF)
- **Conditional logic** based on state

**Example:**
- Professional Tax might be: `=IF(State="Maharashtra", 200, IF(State="Karnataka", 200, 0))`
- Or it might reference a lookup table: `=VLOOKUP(State, TaxTable, 2, FALSE)`

### Step 6: Check for Dependencies

Note which cells depend on others:
- Does Basic depend on Net Salary?
- Does HRA depend on Basic?
- Does PF depend on Basic or Gross?
- Does ESI depend on Gross Salary?

### Step 7: Understand the Calculation Flow

Determine the calculation order:
1. **Input**: Net Salary (or CTC)
2. **Calculate**: Basic, HRA, Bonus, etc.
3. **Calculate**: Gross Total Earnings
4. **Calculate**: Deductions (PF, ESI, PT, LWF, etc.)
5. **Calculate**: Net Salary (verify it matches input)
6. **Calculate**: Employer contributions
7. **Calculate**: CTC

### Step 8: Convert Formulas to JavaScript/TypeScript

Once you have all formulas, convert them to code in `lib/salaryCalculator.ts`:

**Google Sheets Formula:**
```
=IF(B2<21000, B2*0.0075, 0)
```

**JavaScript Equivalent:**
```typescript
const esiEmployee = grossSalary < 21000 ? grossSalary * 0.0075 : 0
```

**Google Sheets Formula:**
```
=VLOOKUP(State, TaxTable!A:B, 2, FALSE)
```

**JavaScript Equivalent:**
```typescript
const professionalTax = PROFESSIONAL_TAX_BY_STATE[state] || 0
```

### Step 9: Test Your Implementation

1. Use the same input values from your sheet
2. Compare the output with your sheet's calculations
3. Adjust until they match exactly

## Common Formula Patterns

### IF Statements
**Sheets:** `=IF(condition, value_if_true, value_if_false)`
**JS:** `condition ? value_if_true : value_if_false`

### VLOOKUP
**Sheets:** `=VLOOKUP(lookup_value, table_array, col_index, FALSE)`
**JS:** Create a lookup object or Map

### SUM
**Sheets:** `=SUM(A1:A10)`
**JS:** `array.reduce((a, b) => a + b, 0)`

### MIN/MAX
**Sheets:** `=MIN(A1, 1800)`
**JS:** `Math.min(value, 1800)`

### Percentage Calculations
**Sheets:** `=A1*0.12`
**JS:** `value * 0.12`

## Quick Method: Export Formulas

### Option 1: Show All Formulas
1. In Google Sheets, press `Ctrl+` (or `Cmd+` on Mac) to show all formulas
2. Copy the entire sheet
3. Paste into a text editor to see all formulas at once

### Option 2: Use Google Apps Script
1. Go to **Extensions > Apps Script**
2. Create a script to read all formulas:
```javascript
function getFormulas() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getDataRange();
  var formulas = range.getFormulas();
  
  // Log formulas to see them
  Logger.log(formulas);
}
```

## What to Share

Once you've extracted the formulas, you can share:
1. A list of all formulas with their cell references
2. Any lookup tables (state-wise tax rates, etc.)
3. The calculation flow/order
4. Any special conditions or rules

Then I can help you implement them exactly in the code!

## Example: What a Complete Formula List Looks Like

```
Cell B5 (Basic Salary): =NetSalary*0.4
Cell B6 (HRA): =B5*0.5
Cell B7 (Bonus): =B5*0.11
Cell B8 (Gross): =SUM(B5:B7)
Cell B9 (PF Employee): =MIN(B5*0.12, 1800)
Cell B10 (ESI Employee): =IF(B8<21000, B8*0.0075, 0)
Cell B11 (Professional Tax): =VLOOKUP(State, TaxTable!A:B, 2, FALSE)
Cell B12 (LWF Employee): =IF(State="Maharashtra", 25, 0)
Cell B13 (Total Deductions): =SUM(B9:B12)
Cell B14 (Net Salary): =B8-B13
```

---

**Need Help?** If you're having trouble finding or understanding any formulas, let me know and I can help you identify them!
