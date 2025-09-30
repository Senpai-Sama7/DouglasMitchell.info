'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
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
import { AIProjectIdeator } from '@/components/AIProjectIdeator'
import { GitHubFeed } from '@/components/GitHubFeed'
import { CustomCursor } from '@/components/CustomCursor'
import { PageTimer } from '@/app/_metrics/page-timer'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { useScrollAnimations } from '@/hooks/useScrollAnimations'

import type { ProjectMetric } from '@/lib/neon'

export default function Page() {
  const [metrics, setMetrics] = useState<ProjectMetric[]>(projectMetricFallback)
  const containerRef = useScrollAnimations({
    parallaxElements: true,
    sectionAnimations: true
  })

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
      <ErrorBoundary>
        <main ref={containerRef} className="axiom-main">
        <CustomCursor />
        <div className="axiom-background">
          <div className="axiom-background__halo" data-parallax="0.12" />
          <div className="axiom-background__grid" data-parallax="-0.08" />
        </div>

        <HeroSection />
        <ProjectsSection metrics={metrics} />

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
                  <p>"{testimonial.quote}"</p>
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
            <ErrorBoundary fallback={<div className="ai-ideator-error">AI Project Ideator temporarily unavailable</div>}>
              <AIProjectIdeator pillars={aiPillars} skills={skillProofs} />
            </ErrorBoundary>
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
            <ErrorBoundary fallback={<div className="github-feed-error">GitHub feed temporarily unavailable</div>}>
              <GitHubFeed />
            </ErrorBoundary>
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

        <ContactSection />
        </main>
      </ErrorBoundary>
    </PageTimer>
  )
}