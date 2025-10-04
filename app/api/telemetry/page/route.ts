import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

import { getLogger } from '@/lib/log'
import { incrementMetric, observeMetric } from '@/lib/metrics'

export const dynamic = 'force-dynamic'

const logger = getLogger('telemetry-api')
const MAX_ABSOLUTE_VALUE = 600000 // 10 minutes in milliseconds

type TelemetryPayload = {
  metric: string
  value: number
  page?: string
}

function normaliseValue(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0
  }

  return Math.max(0, Math.min(Math.abs(value), MAX_ABSOLUTE_VALUE))
}

function recordClientMetric(metric: string, value: number, page: string) {
  // Metric names allow only lowercase letters, numbers, underscores, and hyphens.
  // Page names may include slashes to represent paths, so we allow slashes in addition to the above.
  const safeMetric = metric.trim().replace(/[^a-z0-9_\-]/gi, '_').toLowerCase()
  const safePage = page.trim().replace(/[^a-z0-9_\/-]/gi, '_').toLowerCase() || 'unknown'
  const metricName = `client_${safePage}_${safeMetric}`

  if (safeMetric.endsWith('_ms')) {
    observeMetric(metricName, value)
  } else {
    incrementMetric(metricName, value || 1)
  }

  incrementMetric('client_telemetry_events_total')
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID()
  const startedAt = performance.now()

  let payload: TelemetryPayload | null = null

  try {
    payload = await request.json()
  } catch (error) {
    logger.warn({
      event: 'telemetry.payload.invalid',
      message: 'Received non-JSON telemetry payload',
      requestId,
      error
    })
    return NextResponse.json(
      { error: 'Invalid JSON payload', meta: { requestId } },
      { status: 400 }
    )
  }

  if (!payload || typeof payload.metric !== 'string' || payload.metric.trim() === '') {
    logger.warn({
      event: 'telemetry.metric.invalid',
      message: 'Telemetry payload missing metric name',
      requestId,
      payload
    })
    return NextResponse.json(
      { error: 'Metric name required', meta: { requestId } },
      { status: 400 }
    )
  }

  if (typeof payload.value !== 'number') {
    logger.warn({
      event: 'telemetry.value.invalid',
      message: 'Telemetry payload missing numeric value',
      requestId,
      payload
    })
    return NextResponse.json(
      { error: 'Metric value must be a number', meta: { requestId } },
      { status: 400 }
    )
  }

  const normalisedValue = normaliseValue(payload.value)
  const page = typeof payload.page === 'string' ? payload.page : 'unknown'

  recordClientMetric(payload.metric, normalisedValue, page)

  logger.info({
    event: 'telemetry.metric.recorded',
    message: 'Client telemetry metric recorded',
    metric: payload.metric,
    value: normalisedValue,
    page,
    requestId,
    durationMs: performance.now() - startedAt
  })

  const response = NextResponse.json(
    {
      ok: true,
      meta: {
        requestId,
        receivedAt: new Date().toISOString()
      }
    },
    { status: 202 }
  )

  response.headers.set('cache-control', 'no-store')
  response.headers.set('x-request-id', requestId)

  return response
}
