import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Web Info Hub - All Web Information Tools',
  description: 'Comprehensive web utilities and information tools',
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
