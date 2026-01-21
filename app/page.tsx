'use client'

import { useState } from 'react'
import OfferLetterForm from '@/components/OfferLetterForm'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Offer Letter Generator
      </h1>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Link 
          href="/import-sheet" 
          style={{ 
            color: '#0070f3', 
            textDecoration: 'underline',
            fontSize: '14px'
          }}
        >
          Need to import Google Sheets formulas? Click here
        </Link>
        <span style={{ margin: '0 10px', color: '#999' }}>|</span>
        <Link
          href="/bulk"
          style={{
            color: '#0070f3',
            textDecoration: 'underline',
            fontSize: '14px',
          }}
        >
          Bulk generate from CSV
        </Link>
      </div>
      <OfferLetterForm />
    </div>
  )
}
