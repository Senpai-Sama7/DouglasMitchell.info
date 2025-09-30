'use client'

import { useCallback, useEffect, useRef, useState, memo } from 'react'

type Stat = {
  id: string
  label: string
  value: number
  suffix?: string
  source?: string
}

interface KpiCountersProps {
  stats: Stat[]
}

export const KpiCounters = memo(function KpiCounters({ stats }: KpiCountersProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(false)
  const [displayValues, setDisplayValues] = useState(() => stats.map(() => 0))
  const animationFrameRef = useRef<number | null>(null)

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

  const animateValues = useCallback(() => {
    if (!active) return

    const start = performance.now()
    const duration = 900
    const targets = stats.map(stat => stat.value)
    const startValues = displayValues.slice()

    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / duration)
      const easedProgress = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      
      setDisplayValues(
        targets.map((target, index) => {
          const start = startValues[index] || 0
          return start + (target - start) * easedProgress
        })
      )
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(tick)
      } else {
        animationFrameRef.current = null
      }
    }

    animationFrameRef.current = requestAnimationFrame(tick)
  }, [active, stats, displayValues])

  useEffect(() => {
    animateValues()
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [animateValues])

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
})

function formatValue(value: number) {
  if (value >= 1000) {
    return Math.floor(value).toLocaleString()
  }
  return Math.floor(value)
}