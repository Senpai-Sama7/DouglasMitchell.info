import './globals.css'
import '../styles/performance.css'
import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { seo } from '@/content/site-data'
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  metadataBase: new URL('https://douglasmitchell.info'),
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: 'https://douglasmitchell.info',
    siteName: 'Halcyon Logistics Dispatch',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} site-body`}>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <NavBar />
        <div id="main-content">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
