import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Douglas Mitchell — Anticipatory Systems Lab',
  description:
    'A future-forward personal lab showcasing Axiom-grade interactive systems, GSAP choreography, and human-centered logistics narratives.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="axiom-body">
        {children}
      </body>
    </html>
  )
}
