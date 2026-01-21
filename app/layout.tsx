import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Offer Letter Generator',
  description: 'Generate offer letters with salary breakdown',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
