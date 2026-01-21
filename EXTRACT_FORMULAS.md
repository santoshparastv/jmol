# How to Extract Formulas from Google Sheets

## Method 1: Show Formulas and Copy (Easiest)

1. **Open your Google Sheets**: https://docs.google.com/spreadsheets/d/1kwDlSYN2maubVvT8ccZZ9skqHkgis8cdJBTUvCQjQlc/edit

2. **Go to "CTC Auto Calculator" tab** (bottom of the sheet)

3. **Show all formulas**:
   - Press `Ctrl+` (backtick) on Windows/Linux
   - Press `Cmd+` (backtick) on Mac
   - OR: Go to **View > Show > Formulas**

4. **Select the calculation area** (all cells with formulas)

5. **Copy** (Ctrl+C / Cmd+C)

6. **Paste here** or share with me

## Method 2: Export as CSV with Formulas

1. In Google Sheets, go to **File > Download > Comma Separated Values (.csv)**
2. Open the CSV file
3. Copy the relevant data
4. Share it

## Method 3: Share Sheet Link (Best for Me)

1. Click **Share** button (top right)
2. Click **Change to anyone with the link**
3. Set permission to **Viewer**
4. Copy the link
5. Share the link with me

I can then access it directly and extract all formulas!

## What I Need from "CTC Auto Calculator" Tab

I need to see the formulas for these calculations:
- How Net Salary is calculated (or if it's the input)
- Basic Salary formula
- HRA (House Rent Allowance) formula
- Bonus Amount formula
- Gross Total Earnings formula
- Employee PF formula
- Employee ESI formula
- Professional Tax formula (state-wise)
- Employee LWF formula (state-wise)
- Medicclaim Deduction formula
- Total Deductions formula
- Variable Incentive formula
- Employer PF formula
- PF Admin Charge formula
- PF EDLI Charge formula
- Employer ESI formula
- Employer LWF formula
- Total Benefits formula
- CTC (Cost to Company) formula

## Quick Check

Once you show formulas (Ctrl+`), you should see cells starting with `=` like:
- `=B5*0.4`
- `=IF(B2<21000, B2*0.0075, 0)`
- `=VLOOKUP(State, TaxTable, 2, FALSE)`

These are what I need!
