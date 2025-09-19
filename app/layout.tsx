import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ultimate Dynamic Portfolio',
  description: 'Blazing-fast, dynamic, and actually maintainable.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
