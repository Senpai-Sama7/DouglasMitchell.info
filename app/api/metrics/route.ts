import { randomUUID } from 'node:crypto'
import { performance } from 'node:perf_hooks'
import { NextResponse } from 'next/server'
import { loadProjectMetrics } from '@/lib/neon'
import { getLogger } from '@/lib/log'
import { incrementMetric, recordDurationMetric } from '@/lib/metrics'

export const dynamic = 'force-static'

const logger = getLogger('api.metrics')

export async function GET() {
  const requestId = randomUUID()
  const startedAt = performance.now()

  try {
    const metrics = await loadProjectMetrics()
    const durationMs = Number((performance.now() - startedAt).toFixed(2))
    incrementMetric('axiom_metrics_fetch_success_total')
    logger.info({
      event: 'metrics.fetch.success',
      requestId,
      durationMs,
      count: metrics.length
    })
    return NextResponse.json({ metrics })
  } catch (error) {
    incrementMetric('axiom_metrics_fetch_failure_total')
    logger.error({
      event: 'metrics.fetch.failure',
      requestId,
      durationMs: Number((performance.now() - startedAt).toFixed(2)),
      error
    })
    return NextResponse.json({ metrics: [] }, { status: 500 })
  } finally {
    recordDurationMetric('axiom_metrics_fetch_duration_ms', startedAt)
  }
}
