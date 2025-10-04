import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

import { projectMetrics as fallbackMetrics } from '@/content/site-data'
import { requireApiKey } from '@/lib/auth'
import { getLogger } from '@/lib/log'
import { loadProjectMetrics } from '@/lib/neon'

export const dynamic = 'force-dynamic'

const logger = getLogger('metrics-api')
const CACHE_CONTROL_HEADER = 'public, s-maxage=30, stale-while-revalidate=90'

function withStandardHeaders(response: NextResponse, requestId: string) {
  response.headers.set('cache-control', CACHE_CONTROL_HEADER)
  response.headers.set('vary', 'x-api-key')
  response.headers.set('x-request-id', requestId)
  return response
}

function buildUnauthorizedResponse(requestId: string, response: NextResponse) {
  response.headers.set('cache-control', 'no-store')
  response.headers.set('x-request-id', requestId)
  return response
}

export async function GET(request: NextRequest) {
  const requestId = randomUUID()

  const auth = requireApiKey(request, {
    envVars: ['METRICS_API_KEY', 'NEXT_PUBLIC_METRICS_API_KEY'],
    audience: 'metrics',
    headerName: 'x-api-key'
  })

  if (!auth.ok) {
    logger.warn({
      event: 'metrics.fetch.unauthorised',
      message: 'Metrics request missing or invalid API key',
      requestId,
      path: request.nextUrl.pathname
    })
    return buildUnauthorizedResponse(requestId, auth.response)
  }

  try {
    const start = performance.now()
    const { metrics, source, fetchedAt } = await loadProjectMetrics()

    logger.info({
      event: 'metrics.fetch.success',
      message: 'Served project metrics',
      source,
      requestId,
      durationMs: performance.now() - start,
      count: metrics.length
    })

    const response = NextResponse.json(
      {
        metrics,
        meta: {
          source,
          fetchedAt,
          requestId
        }
      },
      { status: 200 }
    )

    return withStandardHeaders(response, requestId)
  } catch (error) {
    const now = new Date().toISOString()
    logger.error({
      event: 'metrics.fetch.failure',
      message: 'Falling back to static metrics after error',
      requestId,
      error
    })

    const response = NextResponse.json(
      {
        metrics: fallbackMetrics,
        meta: {
          source: 'fallback',
          fetchedAt: now,
          requestId,
          fallback: true
        }
      },
      { status: 200 }
    )

    return withStandardHeaders(response, requestId)
  }
}
