'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { navigationLinks } from '@/content/site-data'
import { ThemeToggle } from './ThemeToggle'

function computeProgress(): number {
  if (typeof window === 'undefined') return 0
  const doc = document.documentElement
  const scrolled = doc.scrollTop || document.body.scrollTop
  const height = doc.scrollHeight - doc.clientHeight
  if (height <= 0) return 0
  return Math.min(1, Math.max(0, scrolled / height))
}

export function NavBar() {
  const [isCompact, setIsCompact] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      setIsCompact(scrolled > 24)
      setProgress(computeProgress())
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const progressStyle = useMemo(() => ({ width: `${progress * 100}%` }), [progress])

  return (
    <header className={`axiom-nav${isCompact ? ' axiom-nav--compact' : ''}`} role="banner">
      <div className="scroll-progress" aria-hidden>
        <span className="scroll-progress__bar" style={progressStyle} />
      </div>
      <div className="axiom-nav__inner">
        <Link href="#home" className="axiom-nav__brand" aria-label="Halcyon Logistics home">
          Halcyon Logistics
        </Link>
        <nav aria-label="Primary" className="axiom-nav__links">
          <ul>
            {navigationLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="axiom-nav__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="axiom-nav__actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
