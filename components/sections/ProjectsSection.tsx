'use client'

import Link from 'next/link'
import { memo } from 'react'
import { projectShowcase } from '@/content/site-data'
import type { ProjectMetric } from '@/lib/neon'

interface ProjectsSectionProps {
  metrics: ProjectMetric[]
}

export const ProjectsSection = memo(function ProjectsSection({ metrics }: ProjectsSectionProps) {
  return (
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
  )
})