## Activity Log

### 2026-01-19
- **Fix**: Resolved JSX parser error in `components/OfferLetterForm.tsx` by closing the PF `.form-row` div before starting the next row.
- **Note**: Added this log to avoid "looping" without trace and to record each change clearly.
- **Change**: Removed the ₹1800 PF cap in `lib/salaryCalculator.ts` (PF is now pure 12% of Basic when applicable).
- **Fix**: Travel Allowance note display - Removed default TA value (3000), now only shows in PDF when TA field is actually filled in the form. Updated validation in API route and PDF generator to properly check for empty/null/NaN values.
- **In Progress**: Adding signature image and completing 6-page PDF structure (Letter of Engagement pages 5-6). Need to add missing styles (logoContainer, addressContainer, logo) and signature image constant.
- **Issue**: Getting stuck on large file edits. Breaking down into smaller steps.

