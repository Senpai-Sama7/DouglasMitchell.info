'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
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
      {/* Modern glassmorphic background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float [animation-delay:2s]"></div>
      </div>

      <div ref={containerRef} className="relative z-10 min-h-screen">
        <CustomCursor />
        <PageTimer />

        {/* Hero Section */}
        <HeroSection />

        {/* Modern Bento Grid Showcase */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass-100 backdrop-blur-xl border border-white/20 text-white/80 text-sm mb-6"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Interactive Experience
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Modern Bento
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Grid</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-white/70 max-w-2xl mx-auto"
              >
                A sleek, glassmorphic interface that adapts to your content. 
                Each card tells a story with beautiful animations and modern design.
              </motion.p>
            </div>
            
            <BentoGrid items={defaultBentoItems} />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex justify-center mt-12"
            >
              <Link 
                href="/admin" 
                className="group inline-flex items-center gap-2 px-8 py-4 bg-glass-200 backdrop-blur-xl border border-white/30 rounded-2xl text-white font-medium hover:bg-glass-300 hover:border-white/50 transition-all duration-300 hover:scale-105"
              >
                <span>Customize Layout</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </motion.div>
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
