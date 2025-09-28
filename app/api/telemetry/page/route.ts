import { NextRequest, NextResponse } from 'next/server'
import { incrementMetric, observeMetric } from '@/lib/metrics'
import { getLogger } from '@/lib/log'

export const dynamic = 'force-dynamic'

const logger = getLogger('api.telemetry')

interface TelemetryPayload {
  metric?: string
  value?: number
  page?: string
}

const MAX_VALUE = 60_000

export async function POST(request: NextRequest) {
  let payload: TelemetryPayload

  try {
    payload = await request.json()
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON payload', code: 'INVALID_PAYLOAD' },
      { status: 400 }
    )
  }

  const { metric, value, page = 'unknown' } = payload

  if (!metric || typeof metric !== 'string') {
    return NextResponse.json(
      { error: 'Missing metric name', code: 'INVALID_PAYLOAD' },
      { status: 400 }
    )
  }

  if (typeof value !== 'number' || Number.isNaN(value)) {
    return NextResponse.json(
      { error: 'Missing or invalid metric value', code: 'INVALID_PAYLOAD' },
      { status: 400 }
    )
  }

  const clampedValue = Math.max(0, Math.min(value, MAX_VALUE))

  const metricName = `page_${metric}`

  observeMetric(metricName, clampedValue)
  incrementMetric('axiom_page_telemetry_total')

  logger.info({
    event: 'telemetry.page',
    metric: metricName,
    value: clampedValue,
    page
  })

  return NextResponse.json({ success: true })
}
