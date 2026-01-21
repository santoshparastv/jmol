'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { generateOfferLetterPDF } from '@/lib/pdfGenerator'

type PFChoice = 'Yes' | 'No'

type BulkRow = {
  firstName: string
  middleName?: string
  lastName: string
  phoneNumber: string
  emailId: string
  pf?: PFChoice
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

function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  // Minimal CSV parser supporting quotes and commas/newlines inside quotes.
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  const pushField = () => {
    row.push(field)
    field = ''
  }
  const pushRow = () => {
    // ignore empty trailing rows
    if (row.length === 1 && row[0].trim() === '') {
      row = []
      return
    }
    rows.push(row)
    row = []
  }

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]

    if (ch === '"') {
      // Escaped quote
      if (inQuotes && text[i + 1] === '"') {
        field += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (!inQuotes && ch === ',') {
      pushField()
      continue
    }

    if (!inQuotes && (ch === '\n' || ch === '\r')) {
      // Handle CRLF
      if (ch === '\r' && text[i + 1] === '\n') i++
      pushField()
      pushRow()
      continue
    }

    field += ch
  }

  // flush
  pushField()
  pushRow()

  const headerRow = rows[0] || []
  const headers = headerRow.map((h) => h.trim()).filter(Boolean)

  const dataRows = rows.slice(1).filter((r) => r.some((c) => c.trim() !== ''))
  const mapped = dataRows.map((r) => {
    const obj: Record<string, string> = {}
    headers.forEach((h, idx) => {
      obj[h] = (r[idx] ?? '').trim()
    })
    return obj
  })

  return { headers, rows: mapped }
}

function normalizePf(value: string | undefined): PFChoice {
  const v = (value || '').trim().toLowerCase()
  if (v === 'no' || v === 'n' || v === 'false' || v === '0') return 'No'
  return 'Yes'
}

export default function BulkPage() {
  const [csvText, setCsvText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)

  const parsed = useMemo(() => {
    if (!csvText.trim()) return null
    try {
      return parseCsv(csvText)
    } catch (e) {
      return null
    }
  }, [csvText])

  const rows = useMemo(() => {
    if (!parsed) return []
    // Map to our expected shape using header names as-is.
    // Required header names are listed in the UI below.
    return parsed.rows as unknown as BulkRow[]
  }, [parsed])

  const handleFile = async (file: File | null) => {
    setLastError(null)
    setProgress(null)
    if (!file) return
    const text = await file.text()
    setCsvText(text)
  }

  const generateAll = async () => {
    setLastError(null)
    if (!rows.length) {
      setLastError('No rows found. Please upload a CSV with a header row and at least 1 data row.')
      return
    }

    setIsGenerating(true)
    setProgress({ current: 0, total: rows.length })
    try {
      for (let idx = 0; idx < rows.length; idx++) {
        setProgress({ current: idx + 1, total: rows.length })
        const r = rows[idx]

        // Basic validation (keep it simple; API will also validate PF rules).
        const firstName = (r.firstName || '').trim()
        const lastName = (r.lastName || '').trim()
        const emailId = (r.emailId || '').trim()
        const phoneNumber = (r.phoneNumber || '').trim()
        // Support both old "location" field (maps to locationState) and new separate fields
        const locationState = (r.locationState || r.location || '').trim()
        const locationCity = (r.locationCity || '').trim()
        const doj = (r.doj || '').trim()
        const designation = (r.designation || '').trim()
        const offerId = (r.offerId || '').trim()
        const nth = (r.nth || '').trim()

        if (!firstName || !lastName || !emailId || !phoneNumber || !locationState || !doj || !designation || !offerId || !nth) {
          throw new Error(`Row ${idx + 1}: missing required fields.`)
        }

        const pf = normalizePf((r.pf as unknown as string) || 'Yes')
        const taValue = (r.ta || '').trim()

        const salaryRes = await fetch('/api/calculate-salary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            netSalary: parseFloat(nth),
            state: locationState,
            pfEnabled: pf === 'Yes',
            travelAllowance: taValue ? parseFloat(taValue) : undefined,
            doj: doj, // Pass DOJ to extract month for LWF/Professional Tax calculations
          }),
        })

        const salaryJson = await salaryRes.json()
        if (!salaryRes.ok) {
          throw new Error(`Row ${idx + 1}: ${salaryJson?.error || 'Failed to calculate salary.'}`)
        }

        await generateOfferLetterPDF({
          firstName,
          middleName: (r.middleName || '').trim(),
          lastName,
          phoneNumber,
          emailId,
          pf,
          locationState,
          locationCity,
          doj,
          nth,
          ta: taValue,
          designation,
          offerId,
          offerSend: (r.offerSend || '').trim(),
          doo: (r.doo || '').trim(),
          clientName: (r.clientName || 'CREDHAS TECHNOLOGY PRIVATE LIMITED').trim(),
          salaryBreakdown: salaryJson,
        })

        // Small delay to reduce browser “multiple downloads” throttling.
        await new Promise((resolve) => setTimeout(resolve, 150))
      }
    } catch (e: any) {
      setLastError(e?.message || 'Bulk generation failed.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadZip = async () => {
    setLastError(null)
    setProgress(null)

    if (!rows.length) {
      setLastError('No rows found. Please upload a CSV with a header row and at least 1 data row.')
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch('/api/bulk-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        setLastError(json?.error || 'Bulk ZIP generation failed.')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `OfferLetters_${new Date().toISOString().slice(0, 10)}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (e: any) {
      setLastError(e?.message || 'Bulk ZIP generation failed.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Bulk Generate Offer Letters (CSV)</h1>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline', fontSize: '14px' }}>
          Back to single form
        </Link>
      </div>

      <div className="form-container">
        <h2 style={{ marginBottom: '0.75rem' }}>1) Upload CSV</h2>
        <input
          type="file"
          accept=".csv,text/csv"
          disabled={isGenerating}
          onChange={(e) => void handleFile(e.target.files?.[0] || null)}
        />

        <p style={{ marginTop: '0.75rem', fontSize: '13px', color: '#444', lineHeight: 1.5 }}>
          Your CSV must have a header row with these column names:
          <br />
          <code>
            firstName,middleName,lastName,phoneNumber,emailId,pf,locationState,locationCity,doj,doo,nth,ta,designation,offerId,offerSend,clientName
          </code>
          <br />
          <small style={{ color: '#666' }}>
            Note: <code>location</code> (legacy) is still supported and maps to <code>locationState</code>. <code>locationCity</code> is optional but recommended.
          </small>
        </p>

        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="Or paste CSV here..."
          style={{
            width: '100%',
            minHeight: '220px',
            padding: '1rem',
            marginTop: '1rem',
            fontFamily: 'monospace',
            fontSize: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
          disabled={isGenerating}
        />

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn" type="button" disabled={isGenerating || !rows.length} onClick={() => void generateAll()}>
            {isGenerating ? 'Generating…' : 'Generate All PDFs'}
          </button>
          <button className="btn" type="button" disabled={isGenerating || !rows.length} onClick={() => void downloadZip()}>
            {isGenerating ? 'Generating…' : 'Download ZIP (Bulk)'}
          </button>
          {progress && (
            <span style={{ fontSize: '13px', color: '#444' }}>
              Progress: {progress.current}/{progress.total}
            </span>
          )}
        </div>

        {lastError && (
          <div style={{ marginTop: '1rem', color: '#b00020', fontSize: '13px' }}>
            <strong>Error:</strong> {lastError}
          </div>
        )}

        {parsed && (
          <div style={{ marginTop: '1rem', fontSize: '13px', color: '#444' }}>
            Parsed <strong>{rows.length}</strong> row(s).
          </div>
        )}
      </div>
    </div>
  )
}

