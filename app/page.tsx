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
import { BentoGrid, defaultBentoItems } from '@/components/BentoGrid'
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

        const data = await response.json()
        if (!cancelled && Array.isArray(data)) {
          setMetrics(data)
        }
      } catch (error) {
        console.warn('Metrics API unavailable, using fallback data')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <ErrorBoundary>
      <div ref={containerRef} className="site-body">
        <CustomCursor />
        <PageTimer />

        {/* Hero Section */}
        <HeroSection />

        {/* Bento Grid Showcase Section */}
        <section className="axiom-section" id="bento-showcase">
          <div className="axiom-section__inner">
            <div className="axiom-section__header">
              <span className="axiom-eyebrow">Interactive Design</span>
              <h2 className="axiom-heading">Bento Grid Experience</h2>
              <p className="axiom-body">
                A modern, interactive layout system inspired by Japanese bento boxes. 
                Each card tells a story, creating an engaging visual narrative.
              </p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <BentoGrid items={defaultBentoItems} />
            </div>

            <div className="flex justify-center mt-8">
              <Link 
                href="/admin" 
                className="axiom-button axiom-button--ghost"
              >
                Customize Layout
              </Link>
            </div>
          </div>
        </section>

        {/* KPI Strip */}
        <section className="axiom-section" id="metrics">
          <div className="axiom-section__inner">
            <div className="kpi-strip">
              {metrics.map((metric, index) => (
                <div key={index} className="kpi-item">
                  <div className="kpi-value">{metric.value}</div>
                  <div className="kpi-label">{metric.label}</div>
                  <div className="kpi-source">{metric.source}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="axiom-section" id="skills">
          <div className="axiom-section__inner">
            <div className="axiom-section__header">
              <span className="axiom-eyebrow">Expertise</span>
              <h2 className="axiom-heading">Skills & Technologies</h2>
              <p className="axiom-body">
                A comprehensive toolkit spanning AI/ML, full-stack development, and emerging technologies.
              </p>
            </div>
            <div className="skills-grid">
              {Object.entries(skillTaxonomy).map(([category, skills]) => (
                <div key={category} className="skill-card">
                  <h3>{category}</h3>
                  <ul>
                    {skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <ProjectsSection />

        {/* Lab Section */}
        <section className="axiom-section" id="lab">
          <div className="axiom-section__inner">
            <div className="axiom-section__header">
              <span className="axiom-eyebrow">Innovation</span>
              <h2 className="axiom-heading">Research Lab</h2>
              <p className="axiom-body">
                Experimental projects and research initiatives pushing the boundaries of AI and technology.
              </p>
            </div>
            <div className="lab-grid">
              {labStreams.map((stream, index) => (
                <div key={index} className="lab-card">
                  <h3>{stream.name}</h3>
                  <p>{stream.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <AIProjectIdeator />
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="axiom-section" id="community">
          <div className="axiom-section__inner">
            <div className="axiom-section__header">
              <span className="axiom-eyebrow">Engagement</span>
              <h2 className="axiom-heading">Community</h2>
              <p className="axiom-body">
                Active participation in the tech community through open source, mentoring, and knowledge sharing.
              </p>
            </div>
            <div className="community-grid">
              {communityHighlights.map((highlight, index) => (
                <div key={index} className="community-card">
                  <h3>{highlight.platform}</h3>
                  <p>{highlight.contribution}</p>
                  <span>{highlight.impact}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <GitHubFeed />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </div>
    </ErrorBoundary>
  )
}
