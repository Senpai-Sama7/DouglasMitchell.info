'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const heroHeadline = 'Architecting Anticipatory Intelligence'
const heroSubtitle =
  'A principal designer documenting how human intuition and computational foresight converge across logistics, media, and immersive systems.'

const capabilities = [
  {
    title: 'Perceptive Interfaces',
    summary:
      'Dynamic panels that predict intent, surface the next best action, and respond to signal strength with real-time choreography.',
    detail: 'Crafted with multi-layer grids, scroll orchestration, and accessible motion primitives.'
  },
  {
    title: 'Adaptive Logistics',
    summary:
      'Decision frameworks that translate volatile supply data into elegant command surfaces for high-stakes teams.',
    detail: 'Includes probabilistic routing, risk telemetry, and ambient notifications designed for clarity.'
  },
  {
    title: 'Narrative Systems',
    summary:
      'Editorial engines that blend essays, audio, and interactive simulations into a unified storytelling cadence.',
    detail: 'Built with modular content matrices and a living library of semantic components.'
  }
]

const architectureNodes = [
  {
    id: 'predictive-core',
    label: 'Predictive Core',
    description: 'Calibrates machine intuition with human override layers to maintain strategic balance.'
  },
  {
    id: 'context-halo',
    label: 'Context Halo',
    description: 'Aggregates telemetry streams and emotional signals into a shared situational canvas.'
  },
  {
    id: 'synthesis-array',
    label: 'Synthesis Array',
    description: 'Transforms raw insight into visual, sonic, and tactile narratives that adapt per medium.'
  },
  {
    id: 'sentinel-loop',
    label: 'Sentinel Loop',
    description: 'Watches for drift, bias, and fatigue; nudges teams with restorative interventions.'
  },
  {
    id: 'memory-vault',
    label: 'Memory Vault',
    description: 'Preserves decision trails so every iteration can be audited, replayed, and remixed.'
  }
]

const manifesto = [
  {
    heading: 'Intelligence as Atmosphere',
    body:
      'Interfaces should anticipate without overwhelming. Systems breathe with the operator, expanding insight when curiosity sparks and receding when focus narrows.'
  },
  {
    heading: 'Elegance in Operations',
    body:
      'Operational tooling deserves poetic craft. Every pixel, pause, and piece of friction should be intentional, legible, and reversible.'
  },
  {
    heading: 'Human-AI Reciprocity',
    body:
      'Technology must feel like a trusted counterpart. I design to illuminate judgment, not replace it, and to leave room for improvisation.'
  }
]

const timeline = [
  {
    title: 'Immersion Labs',
    copy:
      'Real-time simulations built for strategic walkthroughs. Responsive grids, volumetric soundscapes, and predictive hints guide teams through branching futures.'
  },
  {
    title: 'Signal Composers',
    copy:
      'Tunable dashboards that harmonize telemetry streams. Highlighted words reveal source confidence, and stories evolve as the operator explores anomalies.'
  },
  {
    title: 'Living Documentation',
    copy:
      'Interactive manuals that learn from usage. Scroll-triggered callouts, contextual tooltips, and sensor-fed updates keep knowledge evergreen.'
  }
]

const highlights = [
  {
    phrase: 'anticipatory choreography',
    tooltip: 'Sequences every state transition before the user arrives, then adapts when they diverge.'
  },
  {
    phrase: 'precision storytelling',
    tooltip: 'Threads narrative, data, and motion into a single intelligible arc for each persona.'
  },
  {
    phrase: 'audit-ready systems',
    tooltip: 'Every decision path is recorded, explainable, and ready for scrutiny without breaking flow.'
  }
]

const faq = [
  {
    question: 'What tools power these experiences?',
    answer:
      'A hybrid stack of Next.js, vanilla motion primitives, and GSAP for expressive choreography. Every module respects accessibility and reduced motion preferences.'
  },
  {
    question: 'How do you ensure systems stay humane?',
    answer:
      'By embedding checkpoints for emotional tone, adding consentful automation, and designing retreat paths into every high-attention state.'
  },
  {
    question: 'Can these patterns scale to enterprise constraints?',
    answer:
      'Yes. Components are built with CSS custom properties, tokenized grids, and observability hooks so compliance teams can audit without friction.'
  }
]

export default function Page() {
  const progressRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  const heroLetters = useMemo(
    () =>
      heroHeadline.split('').map((character, index) => (
        <span key={`${character}-${index}`} className="hero-letter" aria-hidden="true">
          {character === ' ' ? '\u00A0' : character}
        </span>
      )),
    []
  )

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const prefersReducedMotion = reduceMotionQuery.matches

    const sections = Array.from(document.querySelectorAll<HTMLElement>('.observe-section'))
    const textBlocks = Array.from(document.querySelectorAll<HTMLElement>('.text-reveal'))

    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          } else {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      { threshold: 0.7 }
    )

    sections.forEach(section => sectionObserver.observe(section))

    const textObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          } else {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      { threshold: 0.6 }
    )

    textBlocks.forEach(block => textObserver.observe(block))

    const updateProgress = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const ratio = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${ratio})`
      }
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })

    const parallaxLayers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-speed]'))
    const handleParallax = () => {
      const scrollY = window.scrollY
      parallaxLayers.forEach(layer => {
        const speed = Number(layer.dataset.parallaxSpeed ?? '0')
        layer.style.transform = `translateY(${scrollY * speed}px)`
      })
    }

    handleParallax()
    window.addEventListener('scroll', handleParallax, { passive: true })

    const nav = document.querySelector<HTMLElement>('.audit-nav')
    const handleNav = () => {
      if (!nav) return
      if (window.scrollY > 12) {
        nav.classList.add('is-condensed')
      } else {
        nav.classList.remove('is-condensed')
      }
    }

    handleNav()
    window.addEventListener('scroll', handleNav, { passive: true })

    const pointerFine = window.matchMedia('(pointer: fine)').matches

    const cursorElement = cursorRef.current
    const handlePointerMove = (event: PointerEvent) => {
      if (!cursorElement) return
      cursorElement.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
    }

    const handlePointerDown = () => {
      if (!cursorElement) return
      cursorElement.classList.add('is-clicked')
      window.setTimeout(() => cursorElement.classList.remove('is-clicked'), 200)
    }

    if (pointerFine && cursorElement) {
      cursorElement.style.display = 'block'
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerdown', handlePointerDown)
    } else if (cursorElement) {
      cursorElement.style.display = 'none'
    }

    const preloader = document.querySelector<HTMLElement>('.system-preloader')
    if (preloader) {
      window.setTimeout(() => {
        preloader.classList.add('is-complete')
      }, 1200)
    }

    if (!prefersReducedMotion) {
      gsap.registerPlugin(ScrollTrigger)

      const letters = gsap.utils.toArray<HTMLElement>('.hero-letter')
      gsap.set(letters, { y: 50, opacity: 0, filter: 'blur(8px)' })
      gsap.to(letters, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.05,
        duration: 0.8,
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        delay: 0.2
      })

      const heroSubtitleEl = document.querySelector('.hero-subtitle')
      if (heroSubtitleEl) {
        gsap.fromTo(
          heroSubtitleEl,
          { opacity: 0, y: 30, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
            delay: 0.9
          }
        )
      }

      gsap.utils.toArray<HTMLElement>('.hero-geometry').forEach((shape, index) => {
        gsap.fromTo(
          shape,
          { y: -40, opacity: 0 },
          {
            y: 0,
            opacity: 0.25,
            duration: 1,
            ease: 'power2.out',
            delay: 0.4 + index * 0.2
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('.line-highlight').forEach((line, index) => {
        gsap.fromTo(
          line,
          { y: 40, opacity: 0, filter: 'blur(8px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
            delay: index * 0.1,
            scrollTrigger: {
              trigger: line,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse'
            }
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('.parallax-layer').forEach(layer => {
        const speed = Number(layer.dataset.parallax ?? '0.6')
        gsap.fromTo(
          layer,
          { yPercent: speed * -40 },
          {
            yPercent: speed * 40,
            ease: 'none',
            scrollTrigger: {
              trigger: layer.closest('section') ?? layer,
              scrub: true,
              start: 'top bottom',
              end: 'bottom top'
            }
          }
        )
      })
    }

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('scroll', handleParallax)
      window.removeEventListener('scroll', handleNav)
      if (pointerFine) {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerdown', handlePointerDown)
      }
      sectionObserver.disconnect()
      textObserver.disconnect()
    }
  }, [])

  const toggleFaq = (index: number) => {
    setActiveFaq(prev => (prev === index ? null : index))
  }

  return (
    <>
      <div className="system-preloader" aria-live="polite">
        <div className="preloader-shell">
          <div className="preloader-ring" />
          <p className="preloader-label">System initializing…</p>
        </div>
      </div>

      <div className="cursor-orb" ref={cursorRef} aria-hidden="true" />

      <header className="audit-nav" role="banner">
        <div className="nav-progress" aria-hidden="true">
          <div className="nav-progress-bar" ref={progressRef} />
        </div>
        <nav className="nav-shell" aria-label="Primary">
          <span className="nav-mark">Axiom / Personal Lab</span>
          <ul className="nav-links">
            <li><a href="#capabilities">Capabilities</a></li>
            <li><a href="#architecture">Architecture</a></li>
            <li><a href="#narrative">Narrative</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </nav>
      </header>

      <main className="axiom-shell">
        <section className="axiom-section hero observe-section" id="top">
          <div className="hero-background" aria-hidden="true">
            <div className="hero-geometry" data-parallax-speed="-0.12" />
            <div className="hero-geometry hero-geometry--secondary" data-parallax-speed="-0.2" />
            <div className="hero-grid parallax-layer" data-parallax="0.5" />
          </div>
          <div className="hero-content">
            <p className="hero-kicker text-reveal">System Initialization · 92% Complete</p>
            <h1 className="hero-headline hero-glitch" aria-label={heroHeadline}>
              {heroLetters}
            </h1>
            <p className="hero-subtitle text-reveal">{heroSubtitle}</p>
            <div className="hero-status text-reveal" role="status" aria-live="polite">
              <span className="status-dot" />
              <span>Interactive performance envelope calibrated.</span>
            </div>
            <div className="hero-actions">
              <a className="axiom-button" href="#capabilities">
                Enter the briefing
              </a>
              <a className="axiom-button axiom-button--ghost" href="#narrative">
                Review philosophy
              </a>
            </div>
          </div>
        </section>

        <section className="axiom-section observe-section" id="capabilities">
          <div className="section-heading text-reveal">
            <h2>Capabilities</h2>
            <p>Each module is tuned for asymmetrical grids, parallax choreography, and ethical safeguards.</p>
          </div>
          <div className="capability-grid">
            {capabilities.map(capability => (
              <article key={capability.title} className="capability-card text-reveal" aria-label={capability.title}>
                <h3>{capability.title}</h3>
                <p className="line-highlight">{capability.summary}</p>
                <p className="capability-detail">{capability.detail}</p>
                <button type="button" className="micro-button">
                  Inspect flow
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="axiom-section architecture observe-section" id="architecture">
          <div className="section-heading text-reveal">
            <h2>Architecture Constellation</h2>
            <p>Five interacting nodes express how intelligence flows, monitors, and reconciles with human judgment.</p>
          </div>
          <div className="network-shell" role="presentation">
            <svg className="network-lines" viewBox="0 0 600 400" aria-hidden="true">
              <path className="network-line" d="M120 80 C220 20, 380 20, 480 80" />
              <path className="network-line" d="M120 80 C200 200, 200 200, 300 200" />
              <path className="network-line" d="M300 200 C360 120, 420 120, 480 80" />
              <path className="network-line" d="M300 200 C360 280, 420 280, 480 320" />
              <path className="network-line" d="M120 320 C220 380, 380 380, 480 320" />
              <path className="network-line" d="M120 320 C200 200, 200 200, 300 200" />
            </svg>
            <ul className="network-nodes" aria-label="AI architecture nodes">
              {architectureNodes.map((node, index) => (
                <li
                  key={node.id}
                  className={`network-node text-reveal node-${index + 1}`}
                  tabIndex={0}
                  aria-describedby={`${node.id}-description`}
                >
                  <span className="node-label">{node.label}</span>
                  <span id={`${node.id}-description`} className="node-description">
                    {node.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="axiom-section observe-section" id="narrative">
          <div className="section-heading text-reveal">
            <h2>Scroll Narrative</h2>
            <p>Text reveals occur at a 70% viewport threshold with blur-to-clear transitions and subtle color sweeps.</p>
          </div>
          <div className="narrative-columns">
            {timeline.map(item => (
              <article key={item.title} className="narrative-card text-reveal">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
          <div className="philosophy text-reveal">
            <h3>Design Philosophy</h3>
            <ul>
              {manifesto.map(point => (
                <li key={point.heading}>
                  <strong>{point.heading}</strong>
                  <span>{point.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="axiom-section observe-section highlights">
          <div className="section-heading text-reveal">
            <h2>Highlights</h2>
            <p>
              Hover over each phrase to surface contextual insights. Tooltips stay within viewport and respect focus for keyboard
              navigation.
            </p>
          </div>
          <p className="highlight-text" aria-live="polite">
            {highlights.map(highlight => (
              <span key={highlight.phrase} className="highlight-phrase" data-tooltip={highlight.tooltip}>
                {highlight.phrase}
              </span>
            ))}
          </p>
        </section>

        <section className="axiom-section observe-section" id="faq">
          <div className="section-heading text-reveal">
            <h2>FAQ</h2>
            <p>Accordions animate with smooth height transitions, easing, and accessible toggles.</p>
          </div>
          <ul className="faq-list">
            {faq.map((item, index) => {
              const open = activeFaq === index
              return (
                <li key={item.question} className={`faq-item ${open ? 'is-open' : ''}`}>
                  <button type="button" className="faq-toggle" onClick={() => toggleFaq(index)} aria-expanded={open}>
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="faq-icon">
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  <div className="faq-panel" role="region" aria-hidden={!open}>
                    <p>{item.answer}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </main>

      <footer className="axiom-footer text-reveal" role="contentinfo">
        <p>© {new Date().getFullYear()} Douglas Mitchell · Future-facing systems for curious humans.</p>
        <a className="axiom-button axiom-button--ghost" href="#top">
          Return to origin
        </a>
      </footer>
    </>
  )
}
