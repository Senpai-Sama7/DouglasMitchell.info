'use client'

import { useEffect, useRef } from 'react'

interface PerformanceEntry {
  name: string
  duration: number
  startTime: number
}

interface PerformanceMonitorOptions {
  threshold?: number
  onSlowComponent?: (entry: PerformanceEntry) => void
  enableResourceTiming?: boolean
}

export function usePerformanceMonitor({
  threshold = 100,
  onSlowComponent,
  enableResourceTiming = false
}: PerformanceMonitorOptions = {}) {
  const observerRef = useRef<PerformanceObserver | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.PerformanceObserver) return

    // Monitor component render times
    observerRef.current = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.duration > threshold) {
          const slowEntry: PerformanceEntry = {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          }
          
          console.warn(`Slow component detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`)
          onSlowComponent?.(slowEntry)
        }
      })
    })

    // Observe different types of performance entries
    const entryTypes = ['measure', 'navigation']
    if (enableResourceTiming) {
      entryTypes.push('resource')
    }

    try {
      observerRef.current.observe({ entryTypes })
    } catch (error) {
      console.warn('Performance monitoring not fully supported:', error)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [threshold, onSlowComponent, enableResourceTiming])

  // Utility function to mark component render start
  const markStart = (componentName: string) => {
    if (typeof window !== 'undefined' && window.performance && 'mark' in window.performance) {
      performance.mark(`${componentName}-start`)
    }
  }

  // Utility function to mark component render end and measure
  const markEnd = (componentName: string) => {
    if (typeof window !== 'undefined' && window.performance && 'mark' in window.performance && 'measure' in window.performance) {
      performance.mark(`${componentName}-end`)
      performance.measure(
        componentName,
        `${componentName}-start`,
        `${componentName}-end`
      )
    }
  }

  return { markStart, markEnd }
}