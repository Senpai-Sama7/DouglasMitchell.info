import { promises as fs } from 'node:fs'
import path from 'node:path'
import { performance } from 'node:perf_hooks'

// Load environment variables
import { config } from 'dotenv'
config({ path: '.env.local' })

import { loadProjectMetrics } from '../lib/neon'
import { getMetricsSnapshot, resetMetrics } from '../lib/metrics'

const iterations = Number(process.env.BENCH_ITERATIONS ?? 40)

const durations: number[] = []

const percentile = (values: number[], percentileRank: number) => {
  if (values.length === 0) {
    return 0
  }

  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.min(sorted.length - 1, Math.ceil(percentileRank * sorted.length) - 1)
  return sorted[index]
}

const mean = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0)

async function run() {
  const previousDatabaseUrl = process.env.DATABASE_URL
  process.env.DATABASE_URL = process.env.BENCH_DATABASE_URL ?? ''

  resetMetrics()

  for (let index = 0; index < iterations; index += 1) {
    const startedAt = performance.now()
    await loadProjectMetrics()
    const duration = performance.now() - startedAt
    durations.push(duration)
  }

  const result = {
    iterations,
    unit: 'milliseconds',
    p50: Number(percentile(durations, 0.5).toFixed(3)),
    p95: Number(percentile(durations, 0.95).toFixed(3)),
    p99: Number(percentile(durations, 0.99).toFixed(3)),
    mean: Number(mean(durations).toFixed(3)),
    max: Number(Math.max(...durations).toFixed(3)),
    min: Number(Math.min(...durations).toFixed(3)),
    metricsSnapshot: getMetricsSnapshot()
  }

  const logsDir = path.join(process.cwd(), 'logs')
  await fs.mkdir(logsDir, { recursive: true })
  const outputPath = path.join(logsDir, 'bench-metrics.json')
  await fs.writeFile(outputPath, JSON.stringify(result, null, 2), 'utf8')

  console.log('Metrics bench results written to', outputPath)
  console.table({ p50: result.p50, p95: result.p95, p99: result.p99, mean: result.mean, iterations })

  process.env.DATABASE_URL = previousDatabaseUrl
}

run().catch(error => {
  console.error('Metrics benchmark failed', error)
  process.exitCode = 1
})
