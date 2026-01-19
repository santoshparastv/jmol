'use client'

import { useState } from 'react'

export default function ImportSheetPage() {
  const [pastedData, setPastedData] = useState('')
  const [result, setResult] = useState<string>('')

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPastedData(e.target.value)
  }

  const handleAnalyze = () => {
    // This will help identify the structure
    const lines = pastedData.split('\n')
    setResult(`Found ${lines.length} rows of data.\n\nFirst few rows:\n${lines.slice(0, 5).join('\n')}`)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Import Google Sheets Data</h1>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Instructions:</h2>
        <ol style={{ lineHeight: '2' }}>
          <li>
            <strong>Open your Google Sheets:</strong>{' '}
            <a href="https://docs.google.com/spreadsheets/d/1kwDlSYN2maubVvT8ccZZ9skqHkgis8cdJBTUvCQjQlc/edit" target="_blank" rel="noopener noreferrer">
              Click here to open
            </a>
          </li>
          <li>
            <strong>Go to "CTC Auto Calculator" tab</strong>
          </li>
          <li>
            <strong>Show Formulas:</strong> Press <code>Ctrl+`</code> (or <code>Cmd+`</code> on Mac) to show all formulas
          </li>
          <li>
            <strong>Select all calculation cells</strong> (the area with formulas)
          </li>
          <li>
            <strong>Copy</strong> (Ctrl+C / Cmd+C)
          </li>
          <li>
            <strong>Paste below</strong> and click "Analyze"
          </li>
        </ol>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Paste Sheet Data Here:
        </label>
        <textarea
          value={pastedData}
          onChange={handlePaste}
          placeholder="Paste your sheet data here (with formulas visible)..."
          style={{
            width: '100%',
            minHeight: '300px',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={handleAnalyze}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 2rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Analyze Data
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1rem', backgroundColor: '#fff9e6', borderRadius: '4px' }}>
        <h3>Alternative: Share Sheet with View Access</h3>
        <p>
          If you prefer, you can share the Google Sheet with view access and I can access it directly.
          Just make sure the "CTC Auto Calculator" tab is accessible.
        </p>
      </div>
    </div>
  )
}
