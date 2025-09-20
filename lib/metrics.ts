import { performance } from 'node:perf_hooks'

type Counter = {
  name: string
  value: number
}

type Histogram = {
  name: string
  count: number
  sum: number
  min: number
  max: number
}

type MetricsSnapshot = {
  counters: Counter[]
  histograms: Histogram[]
}

class MetricsRegistry {
  private counters = new Map<string, Counter>()
  private histograms = new Map<string, Histogram>()

  increment(name: string, value = 1) {
    const counter = this.counters.get(name)
    if (counter) {
      counter.value += value
      return
    }

    this.counters.set(name, { name, value })
  }

  observe(name: string, observation: number) {
    const histogram = this.histograms.get(name)
    if (histogram) {
      histogram.count += 1
      histogram.sum += observation
      histogram.min = Math.min(histogram.min, observation)
      histogram.max = Math.max(histogram.max, observation)
      return
    }

    this.histograms.set(name, {
      name,
      count: 1,
      sum: observation,
      min: observation,
      max: observation
    })
  }

  reset() {
    this.counters.clear()
    this.histograms.clear()
  }

  snapshot(): MetricsSnapshot {
    return {
      counters: [...this.counters.values()].sort((a, b) => a.name.localeCompare(b.name)),
      histograms: [...this.histograms.values()].sort((a, b) => a.name.localeCompare(b.name))
    }
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __axiomMetricsRegistry: MetricsRegistry | undefined
}

const getRegistry = () => {
  if (!globalThis.__axiomMetricsRegistry) {
    globalThis.__axiomMetricsRegistry = new MetricsRegistry()
  }

  return globalThis.__axiomMetricsRegistry
}

export function incrementMetric(name: string, value = 1) {
  getRegistry().increment(name, value)
}

export function observeMetric(name: string, observation: number) {
  getRegistry().observe(name, observation)
}

export function recordDurationMetric(name: string, startTime: number, endTime = performance.now()) {
  const duration = Math.max(0, endTime - startTime)
  getRegistry().observe(name, duration)
}

export function resetMetrics() {
  getRegistry().reset()
}

export function getMetricsSnapshot(): MetricsSnapshot {
  return getRegistry().snapshot()
}

export type { MetricsSnapshot }
