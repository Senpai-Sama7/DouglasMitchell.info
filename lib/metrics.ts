import { performance } from 'node:perf_hooks'

type Counter = {
  name: string
  value: number
  timestamp?: number
}

type HistogramObservation = {
  value: number
  timestamp: number
}

type Histogram = {
  name: string
  count: number
  sum: number
  min: number
  max: number
  observations: HistogramObservation[]
  percentiles?: {
    p50: number
    p95: number
    p99: number
  }
}

type MetricsSnapshot = {
  counters: Counter[]
  histograms: Histogram[]
  timestamp: number
  memoryUsage?: NodeJS.MemoryUsage
}

type PercentileConfig = {
  enabled: boolean
  retentionLimit: number  // Maximum observations to keep
  calculationInterval: number  // Recalculate percentiles every N observations
}

type MetricStats = {
  mean: number
  standardDeviation: number
  rate?: number  // For counters
} | null

type TrendData = {
  trend: 'increasing' | 'decreasing' | 'stable'
  recentValues: number[]
  changeRate: number
} | null

class MetricsRegistry {
  private counters = new Map<string, Counter>()
  private histograms = new Map<string, Histogram>()
  private config: PercentileConfig = {
    enabled: true,
    retentionLimit: 1000,
    calculationInterval: 10
  }

  increment(name: string, value = 1) {
    const counter = this.counters.get(name)
    const timestamp = Date.now()
    
    if (counter) {
      counter.value += value
      counter.timestamp = timestamp
      return
    }

    this.counters.set(name, { name, value, timestamp })
  }

  observe(name: string, observation: number) {
    const timestamp = Date.now()
    const hist = this.histograms.get(name)
    
    if (hist) {
      hist.count += 1
      hist.sum += observation
      hist.min = Math.min(hist.min, observation)
      hist.max = Math.max(hist.max, observation)
      
      if (this.config.enabled) {
        hist.observations.push({ value: observation, timestamp })
        
        // Limit observations to prevent memory growth
        if (hist.observations.length > this.config.retentionLimit) {
          hist.observations = hist.observations.slice(-this.config.retentionLimit)
        }
        
        // Recalculate percentiles periodically
        if (hist.count % this.config.calculationInterval === 0) {
          hist.percentiles = this.calculatePercentiles(hist.observations)
        }
      }
      return
    }

    const newHistogram: Histogram = {
      name,
      count: 1,
      sum: observation,
      min: observation,
      max: observation,
      observations: this.config.enabled ? [{ value: observation, timestamp }] : []
    }

    this.histograms.set(name, newHistogram)
  }

  private calculatePercentiles(observations: HistogramObservation[]): { p50: number, p95: number, p99: number } {
    if (observations.length === 0) {
      return { p50: 0, p95: 0, p99: 0 }
    }

    const values = observations.map(obs => obs.value).sort((a, b) => a - b)
    const count = values.length

    return {
      p50: this.percentile(values, 0.5),
      p95: this.percentile(values, 0.95),
      p99: this.percentile(values, 0.99)
    }
  }

  private percentile(sortedValues: number[], percentile: number): number {
    if (sortedValues.length === 0) return 0
    
    const index = Math.max(0, Math.ceil(percentile * sortedValues.length) - 1)
    return sortedValues[Math.min(index, sortedValues.length - 1)]
  }

  // Advanced analytics methods
  getMetricStats(name: string): MetricStats {
    const histogram = this.histograms.get(name)
    if (histogram) {
      const mean = histogram.sum / histogram.count
      const variance = histogram.observations.reduce((acc, obs) => {
        return acc + Math.pow(obs.value - mean, 2)
      }, 0) / histogram.count
      
      return {
        mean,
        standardDeviation: Math.sqrt(variance)
      }
    }

    const counter = this.counters.get(name)
    if (counter && counter.timestamp) {
      const ageMs = Date.now() - counter.timestamp
      const rate = ageMs > 0 ? (counter.value / ageMs) * 1000 : 0  // per second
      
      return {
        mean: counter.value,
        standardDeviation: 0,
        rate
      }
    }

    return null
  }

  // Get trending data for time-series analysis
  getTrend(name: string, windowMs: number = 60000): TrendData {
    const histogram = this.histograms.get(name)
    if (!histogram) return null

    const cutoff = Date.now() - windowMs
    const recentObservations = histogram.observations.filter(obs => obs.timestamp >= cutoff)
    
    if (recentObservations.length < 2) return null

    const values = recentObservations.map(obs => obs.value)
    const firstHalf = values.slice(0, Math.floor(values.length / 2))
    const secondHalf = values.slice(Math.floor(values.length / 2))
    
    const firstMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
    
    const changeRate = ((secondMean - firstMean) / firstMean) * 100
    
    let trend: 'increasing' | 'decreasing' | 'stable'
    if (Math.abs(changeRate) < 5) {
      trend = 'stable'
    } else if (changeRate > 0) {
      trend = 'increasing'
    } else {
      trend = 'decreasing'
    }

    return {
      trend,
      recentValues: values,
      changeRate
    }
  }

  reset() {
    this.counters.clear()
    this.histograms.clear()
  }

  snapshot(): MetricsSnapshot {
    // Calculate percentiles for all histograms on demand
    const histograms = [...this.histograms.values()].map(hist => {
      if (this.config.enabled && hist.observations.length > 0 && !hist.percentiles) {
        hist.percentiles = this.calculatePercentiles(hist.observations)
      }
      return hist
    })

    return {
      counters: [...this.counters.values()].sort((a, b) => a.name.localeCompare(b.name)),
      histograms: histograms.sort((a, b) => a.name.localeCompare(b.name)),
      timestamp: Date.now(),
      memoryUsage: process.memoryUsage()
    }
  }

  // Configuration methods
  configurePercentiles(config: Partial<PercentileConfig>) {
    this.config = { ...this.config, ...config }
  }

  // Export detailed metrics for analysis
  exportDetailedMetrics(): {
    counters: Counter[]
    histograms: (Histogram & { stats?: MetricStats | null, trend?: TrendData | null })[]
    systemMetrics: {
      uptime: number
      memoryUsage: NodeJS.MemoryUsage
      cpuUsage?: NodeJS.CpuUsage
    }
  } {
    const enhancedHistograms = [...this.histograms.values()].map(hist => ({
      ...hist,
      stats: this.getMetricStats(hist.name),
      trend: this.getTrend(hist.name)
    }))

    return {
      counters: [...this.counters.values()],
      histograms: enhancedHistograms,
      systemMetrics: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage?.()
      }
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

export function getMetricStats(name: string) {
  return getRegistry().getMetricStats(name)
}

export function getMetricTrend(name: string, windowMs?: number) {
  return getRegistry().getTrend(name, windowMs)
}

export function configurePercentiles(config: Partial<PercentileConfig>) {
  return getRegistry().configurePercentiles(config)
}

export function exportDetailedMetrics() {
  return getRegistry().exportDetailedMetrics()
}

export type { MetricsSnapshot, Counter, Histogram, PercentileConfig }
