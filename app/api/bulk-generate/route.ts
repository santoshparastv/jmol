import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import path from 'path'
import { readFile } from 'fs/promises'

import { calculateSalaryBreakdown } from '@/lib/salaryCalculator'
import { renderOfferLetterPDFBuffer } from '@/lib/pdfGenerator'

export const runtime = 'nodejs'

type PFChoice = 'Yes' | 'No'

type BulkRow = {
  firstName: string
  middleName?: string
  lastName: string
  phoneNumber: string
  emailId: string
  pf?: PFChoice | string
  location?: string // Legacy field - maps to locationState
  locationState?: string // State for LWF/PT/ESIC calculations
  locationCity?: string // City location
  doj: string
  doo?: string
  nth: string
  ta?: string
  designation: string
  offerId: string
  offerSend?: string
  clientName?: string
}

function normalizePf(value: unknown): PFChoice {
  const v = String(value ?? '').trim().toLowerCase()
  if (v === 'no' || v === 'n' || v === 'false' || v === '0') return 'No'
  return 'Yes'
}

function safeFileName(name: string) {
  // Keep it simple: remove characters Windows dislikes and collapse whitespace
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 180)
}

async function getSignatureDataUri(): Promise<string> {
  const signaturePath = path.join(process.cwd(), 'public', 'signature.png')
  const buf = await readFile(signaturePath)
  return `data:image/png;base64,${buf.toString('base64')}`
}

async function getLogoDataUri(): Promise<string> {
  const logoPath = path.join(process.cwd(), 'public', 'jobsmato-logo.png')
  const buf = await readFile(logoPath)
  return `data:image/png;base64,${buf.toString('base64')}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const rows: BulkRow[] = Array.isArray(body?.rows) ? body.rows : []

    if (!rows.length) {
      return NextResponse.json({ error: 'No rows provided.' }, { status: 400 })
    }

    const [signatureDataUri, logoDataUri] = await Promise.all([getSignatureDataUri(), getLogoDataUri()])
    const zip = new JSZip()

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]

      const firstName = (r.firstName || '').trim()
      const middleName = (r.middleName || '').trim()
      const lastName = (r.lastName || '').trim()
      const phoneNumber = (r.phoneNumber || '').trim()
      const emailId = (r.emailId || '').trim()
      // Support both old "location" field (maps to locationState) and new separate fields
      const locationState = (r.locationState || r.location || '').trim()
      const locationCity = (r.locationCity || '').trim()
      const doj = (r.doj || '').trim()
      const doo = (r.doo || '').trim()
      const designation = (r.designation || '').trim()
      const offerId = (r.offerId || '').trim()
      const offerSend = (r.offerSend || '').trim()
      const nth = (r.nth || '').trim()
      const ta = (r.ta || '').trim()
      const pf = normalizePf(r.pf)
      const clientName = (r.clientName || 'CREDHAS TECHNOLOGY PRIVATE LIMITED').trim()

      if (!firstName || !lastName || !emailId || !phoneNumber || !locationState || !doj || !designation || !offerId || !nth) {
        return NextResponse.json(
          { error: `Row ${i + 1}: missing required fields.` },
          { status: 400 }
        )
      }

      const netSalary = parseFloat(nth)
      if (!Number.isFinite(netSalary) || netSalary <= 0) {
        return NextResponse.json({ error: `Row ${i + 1}: invalid nth (net salary).` }, { status: 400 })
      }

      // Extract month from DOJ for month-specific tax calculations
      const dojDate = new Date(doj)
      const month = dojDate.getMonth() + 1 // 1-12

      // Apply the same PF rule as /api/calculate-salary:
      // If PF is selected "No", validate strict PF-off basic threshold.
      let salaryBreakdown
      if (pf === 'No') {
        const strictPfOff = calculateSalaryBreakdown(netSalary, locationState, false, { enforcePfMandatory: false, month })
        if (strictPfOff.basic <= 15000) {
          return NextResponse.json(
            { error: `Row ${i + 1}: PF is mandatory for Basic Salary ≤ ₹15,000. Please select "Yes" for PF.` },
            { status: 400 }
          )
        }
        salaryBreakdown = strictPfOff
      } else {
        salaryBreakdown = calculateSalaryBreakdown(netSalary, locationState, true, { month })
      }

      // Travel allowance override (optional)
      if (ta) {
        const taValue = parseFloat(ta)
        salaryBreakdown.travelAllowance = Number.isFinite(taValue) && taValue > 0 ? taValue : undefined
      } else {
        salaryBreakdown.travelAllowance = undefined
      }

      const pdfBuf = await renderOfferLetterPDFBuffer({
        firstName,
        middleName,
        lastName,
        phoneNumber,
        emailId,
        pf,
        locationState,
        locationCity,
        doj,
        nth,
        ta,
        designation,
        offerId,
        offerSend,
        doo,
        clientName,
        salaryBreakdown,
        authorisedSignatureSrc: signatureDataUri,
        logoSrc: logoDataUri,
      })

      const pdfName = safeFileName(`Offer_Letter_${firstName}_${lastName}_${offerId || 'OFFER'}.pdf`)
      zip.file(pdfName, pdfBuf)
    }

    const zipBuf = await zip.generateAsync({ type: 'nodebuffer' })
    const fileName = `OfferLetters_${Date.now()}.zip`

    // NextResponse expects a web BodyInit; use Uint8Array (ArrayBufferView) instead of Node Buffer for TS compatibility
    const zipBody = new Uint8Array(zipBuf)

    return new NextResponse(zipBody, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Error bulk generating PDFs:', error)
    return NextResponse.json({ error: 'Failed to bulk generate PDFs.' }, { status: 500 })
  }
}

