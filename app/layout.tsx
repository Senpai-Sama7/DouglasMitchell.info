import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Halcyon Logistics Field Notes',
  description: 'A personal blog exploring logistics, design systems, and immersive storytelling.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 min-h-screen">
        <div className="relative isolate min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.12),transparent_45%)]" />
          <div className="relative">{children}</div>
        </div>
      </body>
    </html>
  )
}
