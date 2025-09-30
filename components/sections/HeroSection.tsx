'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '@/lib/motion'
import { heroContent, kpiStats, toolkitStacks } from '@/content/site-data'
import { KpiCounters } from '@/components/KpiCounters'

interface HeroSectionProps {
  onAnimationComplete?: () => void
}

export function HeroSection({ onAnimationComplete }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)

  const heroLetters = useMemo(
    () =>
      heroContent.headline.split('').map((char, index) => (
        <span key={`${char}-${index}`} className="hero-letter">
          {char === ' ' ? '\u00A0' : char}
        </span>
      )),
    []
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = prefersReducedMotion()

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set('.hero-letter', { opacity: 1, yPercent: 0, rotateX: 0 })
        onAnimationComplete?.()
      } else {
        gsap.from('.hero-letter', {
          yPercent: 120,
          opacity: 0,
          rotateX: -50,
          delay: 0.3,
          duration: 1.5,
          ease: 'power4.out',
          stagger: 0.05,
          onComplete: onAnimationComplete
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [onAnimationComplete])

  return (
    <section id="home" ref={sectionRef} className="axiom-section axiom-section--hero">
      <div className="axiom-section__inner">
        <header className="axiom-section__header">
          <p className="axiom-eyebrow">{heroContent.kicker}</p>
          <h1 className="axiom-hero__headline" aria-label={heroContent.headline}>
            {heroLetters}
          </h1>
          <p className="axiom-hero__subtitle">{heroContent.tagline}</p>
          <p className="axiom-hero__description">{heroContent.subtext}</p>
          <p className="axiom-hero__description axiom-hero__description--muted">{heroContent.description}</p>
          <div className="axiom-hero__actions">
            <Link href={heroContent.primaryCta.href} className="axiom-button axiom-button--primary">
              {heroContent.primaryCta.label}
            </Link>
            <Link href={heroContent.secondaryCta.href} className="axiom-button axiom-button--ghost">
              {heroContent.secondaryCta.label}
            </Link>
          </div>
        </header>
        <KpiCounters stats={kpiStats} />
        <div className="toolkit-grid">
          {toolkitStacks.map(stack => (
            <article key={stack.title} className="toolkit-card">
              <h3>{stack.title}</h3>
              <ul>
                {stack.tools.map(tool => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="axiom-hero__ornaments">
          <div className="axiom-hero__rings" aria-hidden>
            <span className="axiom-hero__ring axiom-hero__ring--primary" data-parallax="0.08" />
            <span className="axiom-hero__ring axiom-hero__ring--secondary" data-parallax="-0.04" />
          </div>
          <Link href="#projects" className="axiom-hero__indicator" aria-label="Scroll to projects section">
            Explore projects
          </Link>
        </div>
      </div>
    </section>
  )
}