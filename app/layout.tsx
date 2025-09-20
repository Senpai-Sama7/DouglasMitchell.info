import './globals.css'
import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { seo } from '@/content/site-data'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} site-body`}>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
