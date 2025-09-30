import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { performance } from 'node:perf_hooks'
import { getConnectionStatus } from '@/lib/neon'
import { exportDetailedMetrics } from '@/lib/metrics'
import { getLogger } from '@/lib/log'
import { requireApiKey } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const logger = getLogger('api.diagnostics')

interface DiagnosticsResponse {
  requestId: string
  timestamp: string
  durationMs: number
  system: {
    uptime: number
    memoryUsage: NodeJS.MemoryUsage
    nodeVersion: string
    platform: string
    arch: string
  }
  database: ReturnType<typeof getConnectionStatus>
  metrics: ReturnType<typeof exportDetailedMetrics>
  health: {
    database: 'healthy' | 'degraded' | 'unhealthy'
    circuitBreaker: 'closed' | 'open'
    overall: 'healthy' | 'degraded' | 'unhealthy'
  }
}

export async function GET(request: NextRequest) {
  const authResult = requireApiKey(request, {
    envVar: 'DIAGNOSTICS_API_KEY',
    envVars: ['DIAGNOSTICS_API_KEY', 'METRICS_API_KEY', 'NEXT_PUBLIC_METRICS_API_KEY'],
    audience: 'diagnostics',
    headerName: 'x-api-key'
  })

  if (!authResult.ok) {
    return authResult.response
  }

  const requestId = randomUUID()
  const startTime = performance.now()
  const timestamp = new Date().toISOString()

  try {
    // Gather system information
    const systemInfo = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    }

    // Get database connection status
    const dbStatus = getConnectionStatus()

    // Get detailed metrics
    const metricsData = exportDetailedMetrics()

    // Determine health status
    const dbHealth = dbStatus.circuitBreaker.isOpen 
      ? 'unhealthy' 
      : dbStatus.primary?.isHealthy 
        ? 'healthy' 
        : 'degraded'

    const circuitBreakerStatus = dbStatus.circuitBreaker.isOpen ? 'open' : 'closed'

    const overallHealth = dbHealth === 'unhealthy' || circuitBreakerStatus === 'open'
      ? 'unhealthy'
      : dbHealth === 'degraded'
        ? 'degraded' 
        : 'healthy'

    const durationMs = Number((performance.now() - startTime).toFixed(2))

    const response: DiagnosticsResponse = {
      requestId,
      timestamp,
      durationMs,
      system: systemInfo,
      database: dbStatus,
      metrics: metricsData,
      health: {
        database: dbHealth,
        circuitBreaker: circuitBreakerStatus,
        overall: overallHealth
      }
    }

    logger.info({
      event: 'diagnostics.success',
      requestId,
      durationMs,
      health: overallHealth
    })

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-ID': requestId
      }
    })

  } catch (error) {
    const durationMs = Number((performance.now() - startTime).toFixed(2))
    
    logger.error({
      event: 'diagnostics.error',
      requestId,
      durationMs,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json({
      error: 'Diagnostics collection failed',
      code: 'DIAGNOSTICS_ERROR',
      requestId,
      timestamp
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-ID': requestId
      }
    })
  }
}