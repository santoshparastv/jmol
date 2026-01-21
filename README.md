# Offer Letter Generator

A Next.js application for generating offer letters with salary breakdown calculations based on Indian state-wise tax rules.

## Features

- **Employee Information Form**: Collect all necessary employee details
- **State-wise Salary Calculation**: Automatically calculates salary breakdown based on:
  - Net salary input
  - Employee's work location (state)
  - Indian tax structure (PF, ESI, Professional Tax, Income Tax)
- **PDF Generation**: Generates professional offer letters in PDF format
- **Download Ready**: One-click download of generated offer letters

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Fill in the employee details form:
   - Personal information (Name, Email, Phone)
   - Employment details (Designation, Location, DOJ)
   - Offer details (Offer ID, Dates)
   - Net salary amount

2. Click "Generate Offer Letter PDF"

3. The PDF will be automatically downloaded with the filename format: `Offer_Letter_[FirstName]_[LastName]_[OfferID].pdf`

## Salary Calculation

The application calculates salary breakdown including:
- Basic Salary
- HRA (House Rent Allowance)
- Special Allowance
- Medical Allowance
- Transport Allowance
- Gross Salary
- Deductions (PF, ESI, Professional Tax, Income Tax)
- Net Salary (Take Home)
- CTC (Cost to Company)

**Note**: The salary calculation formulas need to be updated to match your Google Sheets "CTC Auto Calculator". Currently, it uses a simplified calculation that should be replaced with your actual formulas.

## Customization

### Update Company Details

Edit `lib/pdfGenerator.tsx` to update:
- Company name
- Company address
- Contact information

### Update Salary Calculation

Edit `lib/salaryCalculator.ts` to match your Google Sheets formulas:
- Update the `calculateSalaryBreakdown` function
- Adjust tax rates and calculations
- Add state-specific rules

### Customize PDF Template

Edit `lib/pdfGenerator.tsx` to:
- Change layout and styling
- Add/remove sections
- Modify formatting

## Project Structure

```
├── app/
│   ├── api/
│   │   └── calculate-salary/    # API route for salary calculation
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   └── OfferLetterForm.tsx      # Main form component
├── lib/
│   ├── pdfGenerator.tsx         # PDF generation logic
│   └── salaryCalculator.ts     # Salary calculation logic
└── package.json
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **@react-pdf/renderer**: PDF generation
- **date-fns**: Date formatting

## Important Notes

1. **Salary Calculation**: The current salary calculation is a simplified version. You need to update `lib/salaryCalculator.ts` with the exact formulas from your Google Sheets.

2. **PDF Template**: The PDF template is based on standard Indian offer letter format. You may need to adjust it to match your exact PDF format.

3. **State-wise Rules**: Professional tax and other state-specific rules are currently simplified. Update the `PROFESSIONAL_TAX_BY_STATE` object and calculation logic as needed.

## Next Steps

1. Review the Google Sheets "CTC Auto Calculator" and extract the exact formulas
2. Update `lib/salaryCalculator.ts` with the actual calculation logic
3. Compare the generated PDF with your reference PDF and adjust the template
4. Add any additional fields or sections as needed
5. Test with various salary amounts and states

## License

This project is for personal use.

## Activity Log Policy

All changes must be recorded in `ACTIVITY_LOG.md` (what changed, why, and key files touched).
