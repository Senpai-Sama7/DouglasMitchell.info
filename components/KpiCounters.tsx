'use client'

import { useEffect, useRef, useState } from 'react'

type Stat = {
  id: string
  label: string
  value: number
  suffix?: string
  source?: string
}

export function KpiCounters({ stats }: { stats: Stat[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(false)
  const [displayValues, setDisplayValues] = useState(() => stats.map(() => 0))

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(true)
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return

    let animationFrame: number | null = null
    const start = performance.now()
    const duration = 900
    const targets = stats.map(stat => stat.value)

    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / duration)
      setDisplayValues(targets.map(value => value * progress))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick)
      }
    }

    animationFrame = requestAnimationFrame(tick)
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [active, stats])

  return (
    <div ref={containerRef} className="kpi-strip" aria-live="polite">
      {stats.map((stat, index) => (
        <div key={stat.id} className="kpi-item">
          <div className="kpi-value" data-active={active} data-target={stat.value}>
            {formatValue(displayValues[index])}
            {stat.suffix ?? ''}
          </div>
          <div className="kpi-label">{stat.label}</div>
          {stat.source ? <div className="kpi-source">{stat.source}</div> : null}
        </div>
      ))}
    </div>
  )
}

function formatValue(value: number) {
  if (value >= 1000) {
    return value.toLocaleString()
  }
  return Math.round(value)
}
