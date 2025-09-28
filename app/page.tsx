'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createMotionSafeScrollTrigger, prefersReducedMotion } from '@/lib/motion'
import {
  heroContent,
  kpiStats,
  toolkitStacks,
  projectShowcase,
  projectMetrics as projectMetricFallback,
  skillTaxonomy,
  writingDomains,
  labStreams,
  communityHighlights,
  testimonials,
  watcherStatement,
  bios,
  aiPillars,
  skillProofs
} from '@/content/site-data'
import { KpiCounters } from '@/components/KpiCounters'
import { AIProjectIdeator } from '@/components/AIProjectIdeator'
import { GitHubFeed } from '@/components/GitHubFeed'
import { CustomCursor } from '@/components/CustomCursor'
import { PageTimer } from '@/app/_metrics/page-timer'

import type { ProjectMetric } from '@/lib/neon'

gsap.registerPlugin(ScrollTrigger)

export default function Page() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [metrics, setMetrics] = useState<ProjectMetric[]>(projectMetricFallback)

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
      } else {
        gsap.from('.hero-letter', {
          yPercent: 120,
          opacity: 0,
          rotateX: -50,
          delay: 0.3,
          duration: 1.5,
          ease: 'power4.out',
          stagger: 0.05
        })
      }

      gsap.utils.toArray<HTMLElement>('.axiom-section').forEach(section => {
        const inner = section.querySelector('.axiom-section__inner')
        if (!inner) return

        const triggerConfig = createMotionSafeScrollTrigger(
          {
            trigger: section,
            start: 'top 72%',
            toggleActions: 'play none none reverse'
          },
          {}
        )

        if (!triggerConfig) {
          gsap.set(inner, { opacity: 1, y: 0 })
          return
        }

        gsap.fromTo(
          inner,
          { opacity: 0, y: 56 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
            scrollTrigger: triggerConfig
          }
        )
      })

      if (!reduceMotion) {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(layer => {
          const speed = Number(layer.dataset.parallax) || 0.1
          gsap.to(layer, {
            yPercent: speed * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: layer,
              scrub: true
            }
          })
        })
      } else {
        gsap.set('[data-parallax]', { yPercent: 0 })
      }
    }, rootRef)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting)
        })
      },
      { threshold: 0.7 }
    )

    rootRef.current?.querySelectorAll('.axiom-section').forEach(section => observer.observe(section))

    return () => {
      ctx.revert()
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const metricsApiKey = process.env.NEXT_PUBLIC_METRICS_API_KEY

    ;(async () => {
      try {
        const headers: HeadersInit = { 'cache-control': 'no-cache' }
        if (metricsApiKey) {
          headers['x-api-key'] = metricsApiKey
        }
        const response = await fetch('/api/metrics', {
          cache: 'no-store',
          headers
        })
        if (!response.ok) return
        const payload = (await response.json()) as { metrics?: ProjectMetric[] }
        if (!cancelled && payload.metrics?.length) {
          setMetrics(payload.metrics)
        }
      } catch (error) {
        // Swallow errors and retain fallback metrics
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <PageTimer pageName="home">
      <main ref={rootRef} className="axiom-main">
      <CustomCursor />
      <div className="axiom-background">
        <div className="axiom-background__halo" data-parallax="0.12" />
        <div className="axiom-background__grid" data-parallax="-0.08" />
      </div>

      <section id="home" className="axiom-section axiom-section--hero">
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

      <section id="projects" className="axiom-section axiom-section--work">
        <div className="axiom-section__inner">
          <header className="axiom-section__header">
            <p className="axiom-eyebrow">Projects</p>
            <h2 className="axiom-heading">Precision systems with measurable outcomes.</h2>
            <p className="axiom-body">
              Each case study fuses architecture, validation, and ethical guardrails. Hover to reveal stacks and validation rituals.
            </p>
          </header>
          <div className="axiom-projects">
            {projectShowcase.map(project => (
              <article key={project.id} className={`axiom-project-card axiom-project-card--${project.slug}`}>
                <div className="axiom-project-card__visual" aria-hidden>
                  <div className="axiom-project-card__blur" />
                  <div className="axiom-project-card__overlay">
                    <p>{project.architecture}</p>
                    <ul>
                      {project.tech.map(tool => (
                        <li key={tool}>{tool}</li>
                      ))}
                    </ul>
                    {project.links ? (
                      <div className="axiom-project-card__links">
                        {project.links.map(link => (
                          <Link key={link.href} href={link.href} className="axiom-project-card__link" target="_blank" rel="noreferrer">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="axiom-project-card__copy">
                  <p className="axiom-project-card__format">{project.format}</p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <div className="axiom-project-card__meta">
                    <span>{project.outcomes}</span>
                    <div className="axiom-project-card__tags">
                      {project.tags.map(tag => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <Link href={project.href} className="axiom-button axiom-button--inline">
                    Read architecture & validation
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <aside className="axiom-metrics">
            {metrics.map(metric => (
              <div key={metric.id} className="axiom-metric">
                <p className="axiom-metric__value">
                  {metric.value}
                  <span>{metric.unit}</span>
                </p>
                <p className="axiom-metric__label">{metric.label}</p>
                <p className="axiom-metric__detail">{metric.detail}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section id="about" className="axiom-section axiom-section--about">
        <div className="axiom-section__inner">
          <header className="axiom-section__header">
            <p className="axiom-eyebrow">About</p>
            <h2 className="axiom-heading">{bios.short}</h2>
            <p className="axiom-body">{bios.medium}</p>
          </header>
          <div className="testimonial-grid">
            {testimonials.map(testimonial => (
              <blockquote key={testimonial.id} className="testimonial-card">
                <p>“{testimonial.quote}”</p>
                <footer>
                  <span>{testimonial.author}</span>
                  <span>{testimonial.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
          <div className="watcher">{watcherStatement}</div>
        </div>
      </section>

      <section id="skills" className="axiom-section axiom-section--skills">
        <div className="axiom-section__inner">
          <header className="axiom-section__header">
            <p className="axiom-eyebrow">Skills</p>
            <h2 className="axiom-heading">Cross-domain mastery anchored in safety.</h2>
            <p className="axiom-body">
              Systems thinking, security hygiene, and conscious network leadership keep every deployment grounded in measurable trust.
            </p>
          </header>
          <div className="skills-grid">
            {skillTaxonomy.map(skill => (
              <article key={skill.id} className="skill-card">
                <h3>{skill.title}</h3>
                <p>{skill.summary}</p>
                <ul>
                  {skill.bullets.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <AIProjectIdeator pillars={aiPillars} skills={skillProofs} />
        </div>
      </section>

      <section id="writing" className="axiom-section axiom-section--writing">
        <div className="axiom-section__inner">
          <header className="axiom-section__header">
            <p className="axiom-eyebrow">Writing</p>
            <h2 className="axiom-heading">Dispatches documenting evidence and vigilance.</h2>
            <p className="axiom-body">
              Essays, research logs, and influence guides connect architecture thinking with community outcomes.
            </p>
          </header>
          <div className="writing-grid">
            {writingDomains.map(domain => (
              <article key={domain.id} className="writing-card">
                <h3>{domain.title}</h3>
                <p>{domain.summary}</p>
                <ul>
                  {domain.prompts.map(prompt => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <GitHubFeed />
        </div>
      </section>

      <section id="lab" className="axiom-section axiom-section--lab">
        <div className="axiom-section__inner">
          <header className="axiom-section__header">
            <p className="axiom-eyebrow">Lab</p>
            <h2 className="axiom-heading">Research streams keeping the axiom protocol sharp.</h2>
            <p className="axiom-body">
              Benchmarks, pipeline experiments, and security drills are documented with reproducibility checklists.
            </p>
          </header>
          <div className="lab-grid">
            {labStreams.map(stream => (
              <article key={stream.id} className="lab-card">
                <h3>{stream.title}</h3>
                <p>{stream.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="axiom-section axiom-section--community">
        <div className="axiom-section__inner">
          <header className="axiom-section__header">
            <p className="axiom-eyebrow">Community</p>
            <h2 className="axiom-heading">Conscious network infrastructure in motion.</h2>
            <p className="axiom-body">
              Environmental justice, coalition enablement, and cross-cluster trust-building are engineered with the same rigor as production systems.
            </p>
          </header>
          <div className="community-grid">
            {communityHighlights.map(highlight => (
              <article key={highlight.id} className="community-card">
                <h3>{highlight.title}</h3>
                <p>{highlight.summary}</p>
                <span>{highlight.cta}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="axiom-section axiom-section--contact">
        <div className="axiom-section__inner">
          <header className="axiom-section__header">
            <p className="axiom-eyebrow">Contact</p>
            <h2 className="axiom-heading">Bring the next dispatch to life.</h2>
            <p className="axiom-body">
              The portal routes straight to Douglas. Expect a response inside 48 hours with integration notes and validation pathways.
            </p>
          </header>
          <form className="axiom-form" action="/api/subscribe" method="post">
            <div className="axiom-form__group">
              <input id="name" name="name" type="text" placeholder=" " required />
              <label htmlFor="name">Name</label>
              <span className="axiom-form__hint">Who should I coordinate with?</span>
            </div>
            <div className="axiom-form__group">
              <input id="email" name="email" type="email" placeholder=" " required />
              <label htmlFor="email">Email</label>
              <span className="axiom-form__hint">Replies land within 48 hours.</span>
            </div>
            <div className="axiom-form__group axiom-form__group--full">
              <textarea id="context" name="context" placeholder=" " rows={4} required />
              <label htmlFor="context">Mission brief</label>
              <span className="axiom-form__hint">Share goals, scope, timeline, and Neon requirements.</span>
            </div>
            <div className="axiom-form__actions">
              <button type="submit" className="axiom-button axiom-button--primary" data-loading-text="Sending…">
                Initiate contact
              </button>
            </div>
            <p className="axiom-form__footnote">Privacy-first analytics. Secrets stored in secure vaults. Reversible delivery guaranteed.</p>
          </form>
        </div>
      </section>
      </main>
    </PageTimer>
  )
}
