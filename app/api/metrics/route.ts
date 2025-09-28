import { randomUUID } from 'node:crypto'
import { performance } from 'node:perf_hooks'
import { NextRequest, NextResponse } from 'next/server'
import { loadProjectMetrics } from '@/lib/neon'
import { getLogger } from '@/lib/log'
import { incrementMetric, recordDurationMetric } from '@/lib/metrics'
import { requireApiKey } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const logger = getLogger('api.metrics')

interface MetricsSuccessResponse {
  metrics: Array<{
    id: string
    label: string
    value: number
    unit: string
    detail: string
  }>
  meta?: {
    requestId: string
    timestamp: string
    durationMs: number
    source: 'database' | 'fallback'
    fetchedAt: string
  }
}

interface MetricsErrorResponse {
  error: string
  code: string
  requestId: string
  timestamp: string
}

export async function GET(request: NextRequest) {
  const authResult = requireApiKey(request, {
    envVar: 'METRICS_API_KEY',
    envVars: ['METRICS_API_KEY', 'NEXT_PUBLIC_METRICS_API_KEY'],
    audience: 'metrics',
    headerName: 'x-api-key'
  })

  if (!authResult.ok) {
    return authResult.response
  }

  const requestId = randomUUID()
  const startedAt = performance.now()
  const timestamp = new Date().toISOString()

  try {
    const { metrics, source, fetchedAt } = await loadProjectMetrics()
    const durationMs = Number((performance.now() - startedAt).toFixed(2))
    incrementMetric('axiom_metrics_fetch_success_total')
    logger.info({
      event: 'metrics.fetch.success',
      requestId,
      durationMs,
      count: metrics.length,
      source
    })

    const response: MetricsSuccessResponse = {
      metrics,
      meta: {
        requestId,
        timestamp,
        durationMs,
        source,
        fetchedAt
      }
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=90',
        'X-Request-ID': requestId
      }
    })
  } catch (error) {
    incrementMetric('axiom_metrics_fetch_failure_total')
    const durationMs = Number((performance.now() - startedAt).toFixed(2))
    logger.error({
      event: 'metrics.fetch.failure',
      requestId,
      durationMs,
      error
    })

    const errorResponse: MetricsErrorResponse = {
      error: 'Failed to fetch metrics',
      code: 'METRICS_FETCH_ERROR',
      requestId,
      timestamp
    }

    return NextResponse.json(errorResponse, {
      status: 500,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=90',
        'X-Request-ID': requestId
      }
    })
  } finally {
    recordDurationMetric('axiom_metrics_fetch_duration_ms', startedAt)
  }
}
