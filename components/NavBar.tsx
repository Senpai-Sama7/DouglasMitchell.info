'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const bodyOverflow = useRef<string | null>(null)

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

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    if (isMenuOpen) {
      if (bodyOverflow.current === null) {
        bodyOverflow.current = document.body.style.overflow
      }
      document.body.style.overflow = 'hidden'
    } else if (bodyOverflow.current !== null) {
      document.body.style.overflow = bodyOverflow.current
      bodyOverflow.current = null
    }

    return () => {
      if (bodyOverflow.current !== null) {
        document.body.style.overflow = bodyOverflow.current
        bodyOverflow.current = null
      }
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen || typeof window === 'undefined') {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

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
        <nav aria-label="Primary" className={`axiom-nav__links${isMenuOpen ? ' axiom-nav__links--open' : ''}`}>
          <ul>
            {navigationLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="axiom-nav__link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="axiom-nav__actions">
          <button
            type="button"
            className={`axiom-nav__toggle${isMenuOpen ? ' axiom-nav__toggle--active' : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(prev => !prev)}
          >
            <span className="axiom-nav__toggle-icon" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            <span className="axiom-nav__toggle-label">Menu</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
      <button
        type="button"
        className={`axiom-nav__backdrop${isMenuOpen ? ' axiom-nav__backdrop--visible' : ''}`}
        tabIndex={-1}
        aria-hidden={!isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
      />
    </header>
  )
}
