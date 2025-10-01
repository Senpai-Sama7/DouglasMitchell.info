'use client'

import { useEffect, useRef } from 'react'
import { getLogger } from '@/lib/log'

const logger = getLogger('page-timer')

interface PageTimerProps {
  children: React.ReactNode
  pageName?: string
}

const TELEMETRY_ENDPOINT = '/api/telemetry/page'

function dispatchMetric(metricName: string, value: number, pageName: string) {
  if (typeof navigator === 'undefined') return

  const payload = JSON.stringify({ metric: metricName, value, page: pageName })

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon(TELEMETRY_ENDPOINT, blob)
      return
    }

    fetch(TELEMETRY_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload,
      keepalive: true
    }).catch(() => {
      // swallow network errors silently
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV === 'development') {
      logger.warn({
        event: 'telemetry.dispatch.failed',
        message: 'Telemetry dispatch failed',
        error
      })
    }
  }
}

export function PageTimer({ children, pageName = 'unknown' }: PageTimerProps) {
  const renderStartRef = useRef<number>(Date.now())
  const mountStartRef = useRef<number>(0)

  useEffect(() => {
    // Record mount start time
    mountStartRef.current = performance.now()

    // Record render duration (from component creation to mount)
    const renderDuration = performance.now() - renderStartRef.current
    dispatchMetric('render_duration_ms', renderDuration, pageName)

    // Set up intersection observer to track when page becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const visibilityDuration = performance.now() - mountStartRef.current

            dispatchMetric('visibility_duration_ms', visibilityDuration, pageName)

            // Disconnect after first visibility
            observer.disconnect()
          }
        })
      },
      {
        threshold: [0.1, 0.5, 0.9]
      }
    )

    // Observe the document body or a main content element
    const mainElement = document.querySelector('main') || document.body
    if (mainElement) {
      observer.observe(mainElement)
    }

    return () => {
      observer.disconnect()
    }
  }, [pageName])

  // Track paint timing if available
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'paint') {
          // Record specific paint metrics
          if (entry.name === 'first-contentful-paint') {
            dispatchMetric('fcp_ms', entry.startTime, pageName)
          }
          if (entry.name === 'largest-contentful-paint') {
            dispatchMetric('lcp_ms', entry.startTime, pageName)
          }
        }
      })
    })

    observer.observe({ entryTypes: ['paint'] })

    return () => {
      observer.disconnect()
    }
  }, [pageName])

  return <>{children}</>
}
