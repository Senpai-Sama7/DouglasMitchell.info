import { neon } from '@neondatabase/serverless'
import { projectMetrics as fallbackMetrics } from '@/content/site-data'
import { getLogger } from '@/lib/log'
import { incrementMetric, recordDurationMetric } from '@/lib/metrics'

export interface ProjectMetric {
  id: string
  label: string
  value: number
  unit: string
  detail: string
}

export interface LoadMetricsResult {
  metrics: ProjectMetric[]
  source: 'database' | 'fallback'
  fetchedAt: string
}

type MetricRow = {
  id: string
  label: string
  value: number
  unit: string
  detail: string
}

const logger = getLogger('neon')

// Enhanced connection management
interface ConnectionConfig {
  client: any
  connectionString: string
  mode: 'pooled' | 'unpooled'
  createdAt: number
  lastUsed: number
  useCount: number
  isHealthy: boolean
}

interface ConnectionPool {
  primary?: ConnectionConfig
  fallback?: ConnectionConfig
  healthCheckInterval: NodeJS.Timeout | null
}

const connectionPool: ConnectionPool = {
  healthCheckInterval: null
}

// Logging state to prevent spam
let loggedMissingConnection = false
let loggedInitialised = false
let loggedReuse = false
let loggedFallbackStatic = false
let loggedEmptyResults = false
let loggedHealthCheck = false

// Memoized client cache
let memoizedClient: ReturnType<typeof neon> | null | undefined

// Configuration
const NEON_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 1000,
  healthCheckIntervalMs: 300000, // 5 minutes
  connectionTimeoutMs: 10000,
  maxConnectionAge: 3600000, // 1 hour
  circuitBreakerThreshold: 5,
  circuitBreakerResetTimeMs: 60000
}

// Circuit breaker state
let circuitBreakerFailCount = 0
let circuitBreakerLastFailTime = 0
let isCircuitBreakerOpen = false

function resolveConnectionString() {
  const unpooled = process.env.DATABASE_URL_UNPOOLED
  if (unpooled) {
    return { connectionString: unpooled, mode: 'unpooled' as const }
  }

  const pooled = process.env.DATABASE_URL
  if (pooled) {
    return { connectionString: pooled, mode: 'pooled' as const }
  }

  return null
}

// Circuit breaker implementation
function isCircuitBreakerOpenCheck(): boolean {
  if (!isCircuitBreakerOpen) return false
  
  if (Date.now() - circuitBreakerLastFailTime > NEON_CONFIG.circuitBreakerResetTimeMs) {
    isCircuitBreakerOpen = false
    circuitBreakerFailCount = 0
    logger.info({ event: 'neon.circuit_breaker.reset', message: 'Circuit breaker reset' })
    return false
  }
  
  return true
}

function recordCircuitBreakerFailure() {
  circuitBreakerFailCount++
  circuitBreakerLastFailTime = Date.now()
  
  if (circuitBreakerFailCount >= NEON_CONFIG.circuitBreakerThreshold) {
    isCircuitBreakerOpen = true
    logger.warn({ 
      event: 'neon.circuit_breaker.open', 
      message: 'Circuit breaker opened due to repeated failures',
      failCount: circuitBreakerFailCount 
    })
  }
}

function recordCircuitBreakerSuccess() {
  circuitBreakerFailCount = 0
  if (isCircuitBreakerOpen) {
    isCircuitBreakerOpen = false
    logger.info({ event: 'neon.circuit_breaker.closed', message: 'Circuit breaker closed after successful operation' })
  }
}

// Enhanced connection creation with retry logic
async function createConnection(connectionString: string, mode: 'pooled' | 'unpooled'): Promise<ConnectionConfig | null> {
  for (let attempt = 1; attempt <= NEON_CONFIG.maxRetries; attempt++) {
    try {
      const client = neon(connectionString)
      
      // Test connection with a simple query
      await Promise.race([
        client`SELECT 1 as test`,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), NEON_CONFIG.connectionTimeoutMs))
      ])

      const config: ConnectionConfig = {
        client,
        connectionString,
        mode,
        createdAt: Date.now(),
        lastUsed: Date.now(),
        useCount: 0,
        isHealthy: true
      }

      incrementMetric('neon_connection_created_total')
      logger.info({ 
        event: 'neon.connection.created', 
        message: `Neon client created (${mode})`,
        mode,
        attempt 
      })

      return config
    } catch (error) {
      incrementMetric('neon_connection_failed_total')
      logger.warn({
        event: 'neon.connection.attempt_failed',
        message: `Connection attempt ${attempt} failed`,
        error: error instanceof Error ? error.message : 'Unknown error',
        attempt,
        mode
      })

      if (attempt < NEON_CONFIG.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, NEON_CONFIG.retryDelayMs * attempt))
      }
    }
  }

  return null
}

// Health check for existing connections
async function healthCheck(config: ConnectionConfig): Promise<boolean> {
  if (!config.client) return false

  try {
    await Promise.race([
      config.client`SELECT 1 as health_check`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Health check timeout')), 5000))
    ])

    config.isHealthy = true
    incrementMetric('neon_health_check_success_total')
    return true
  } catch (error) {
    config.isHealthy = false
    incrementMetric('neon_health_check_failed_total')
    logger.warn({
      event: 'neon.health_check.failed',
      message: 'Connection health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      mode: config.mode
    })
    return false
  }
}

// Get best available connection  
export function getNeonClient(): any | null {
  // Check circuit breaker
  if (isCircuitBreakerOpenCheck()) {
    incrementMetric('neon_circuit_breaker_blocked_total')
    if (!loggedMissingConnection) {
      logger.warn({ event: 'neon.circuit_breaker.blocked', message: 'Circuit breaker is open, blocking requests' })
      loggedMissingConnection = true
    }
    return null
  }

  const now = Date.now()

  // Check primary connection
  if (connectionPool.primary) {
    const config = connectionPool.primary
    
    // Check if connection is too old
    if (now - config.createdAt > NEON_CONFIG.maxConnectionAge) {
      logger.info({ event: 'neon.connection.expired', message: 'Primary connection expired, will recreate' })
      connectionPool.primary = undefined
    } else if (config.isHealthy) {
      config.lastUsed = now
      config.useCount++
      
      if (!loggedReuse && config.useCount > 1) {
        logger.debug({ 
          event: 'neon.connection.reuse', 
          message: 'Reusing existing connection',
          useCount: config.useCount,
          mode: config.mode
        })
        loggedReuse = true
      }

      return config.client
    }
  }

  // Try to create new connection
  const resolved = resolveConnectionString()
  if (!resolved) {
    if (!loggedMissingConnection) {
      logger.warn({ 
        event: 'neon.connection.missing', 
        message: 'No Neon connection string provided; falling back to static metrics' 
      })
      loggedMissingConnection = true
    }
    return null
  }

  // For synchronous API, we can't await async connection creation
  // Return null and let the caller handle fallback
  if (!connectionPool.primary || !connectionPool.primary.isHealthy) {
    // Trigger async connection creation (fire and forget)
    createConnection(resolved.connectionString, resolved.mode)
      .then(config => {
        if (config) {
          connectionPool.primary = config
          recordCircuitBreakerSuccess()
        } else {
          recordCircuitBreakerFailure()
        }
      })
      .catch(error => {
        recordCircuitBreakerFailure()
        logger.error({ 
          event: 'neon.connection.async_creation_failed', 
          message: 'Async connection creation failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      })

    return null
  }

  return connectionPool.primary.client
}

// Initialize health checking
function initializeHealthChecking() {
  if (connectionPool.healthCheckInterval) return

  connectionPool.healthCheckInterval = setInterval(async () => {
    if (!loggedHealthCheck) {
      logger.debug({ event: 'neon.health_check.started', message: 'Starting periodic health check' })
      loggedHealthCheck = true
    }

    if (connectionPool.primary) {
      await healthCheck(connectionPool.primary)
    }
  }, NEON_CONFIG.healthCheckIntervalMs)
}

// Initialize on module load
initializeHealthChecking()

function wrapResult(metrics: ProjectMetric[], source: 'database' | 'fallback'): LoadMetricsResult {
  return {
    metrics,
    source,
    fetchedAt: new Date().toISOString()
  }
}

export async function loadProjectMetrics(): Promise<LoadMetricsResult> {
  const startTime = performance.now()
  incrementMetric('neon_query_attempt_total')

  const sql = getNeonClient()
  if (!sql) {
    incrementMetric('neon_fallback_static_total')
    recordDurationMetric('neon_query_duration_ms', startTime)
    
    if (!loggedFallbackStatic) {
      logger.info({ event: 'metrics.fallback.static', message: 'Serving static metrics fallback' })
      loggedFallbackStatic = true
    }
    return wrapResult(fallbackMetrics, 'fallback')
  }

  try {
    // Add query timeout and retry logic
    const queryPromise = sql`SELECT id, label, value, unit, detail, recorded_at FROM axiom_metrics ORDER BY recorded_at DESC`
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout')), NEON_CONFIG.connectionTimeoutMs)
    )

    const rows = (await Promise.race([queryPromise, timeoutPromise])) as (MetricRow & { recorded_at?: Date | string | null })[]

    incrementMetric('neon_query_success_total')
    recordDurationMetric('neon_query_duration_ms', startTime)
    recordCircuitBreakerSuccess()

    if (!rows?.length) {
      incrementMetric('neon_query_empty_total')
      if (!loggedEmptyResults) {
        logger.warn({ event: 'metrics.query.empty', message: 'Neon metrics table empty, using fallback data' })
        loggedEmptyResults = true
      }
      return wrapResult(fallbackMetrics, 'fallback')
    }

    const metrics = rows.map(row => ({
      id: row.id,
      label: row.label,
      value: Number(row.value),
      unit: row.unit,
      detail: row.detail
    }))

    incrementMetric('neon_records_fetched_total', metrics.length)
    logger.debug({ 
      event: 'metrics.query.success', 
      message: 'Successfully fetched metrics from database',
      count: metrics.length,
      durationMs: performance.now() - startTime
    })

    return wrapResult(metrics, 'database')
  } catch (error) {
    incrementMetric('neon_query_error_total')
    recordDurationMetric('neon_query_duration_ms', startTime)
    recordCircuitBreakerFailure()
    
    logger.error({ 
      event: 'metrics.query.error', 
      message: 'Error querying Neon metrics; using fallback data',
      error: error instanceof Error ? error.message : 'Unknown error',
      durationMs: performance.now() - startTime
    })
    
    return wrapResult(fallbackMetrics, 'fallback')
  }
}

// Enhanced connection status and diagnostics
export function getConnectionStatus(): {
  primary?: {
    isHealthy: boolean
    useCount: number
    ageMs: number
    mode: string
  }
  circuitBreaker: {
    isOpen: boolean
    failCount: number
    lastFailTime: number
  }
  metrics: {
    totalConnections: number
    totalQueries: number
    totalErrors: number
  }
} {
  const now = Date.now()
  
  return {
    primary: connectionPool.primary ? {
      isHealthy: connectionPool.primary.isHealthy,
      useCount: connectionPool.primary.useCount,
      ageMs: now - connectionPool.primary.createdAt,
      mode: connectionPool.primary.mode
    } : undefined,
    circuitBreaker: {
      isOpen: isCircuitBreakerOpen,
      failCount: circuitBreakerFailCount,
      lastFailTime: circuitBreakerLastFailTime
    },
    metrics: {
      totalConnections: connectionPool.primary ? 1 : 0,
      totalQueries: connectionPool.primary?.useCount || 0,
      totalErrors: circuitBreakerFailCount
    }
  }
}

// Force connection refresh (useful for testing and recovery)
export async function refreshConnection(): Promise<boolean> {
  const resolved = resolveConnectionString()
  if (!resolved) return false

  try {
    const newConfig = await createConnection(resolved.connectionString, resolved.mode)
    if (newConfig) {
      // Clean up old connection interval if needed
      if (connectionPool.healthCheckInterval) {
        clearInterval(connectionPool.healthCheckInterval)
        connectionPool.healthCheckInterval = null
      }

      connectionPool.primary = newConfig
      recordCircuitBreakerSuccess()
      initializeHealthChecking()
      
      logger.info({ 
        event: 'neon.connection.refreshed', 
        message: 'Connection refreshed successfully',
        mode: newConfig.mode 
      })
      
      return true
    }
  } catch (error) {
    recordCircuitBreakerFailure()
    logger.error({ 
      event: 'neon.connection.refresh_failed', 
      message: 'Failed to refresh connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  return false
}

export function __resetNeonClientForTests() {
  // Clear connection pool
  connectionPool.primary = undefined
  connectionPool.fallback = undefined
  
  if (connectionPool.healthCheckInterval) {
    clearInterval(connectionPool.healthCheckInterval)
    connectionPool.healthCheckInterval = null
  }

  // Reset circuit breaker
  circuitBreakerFailCount = 0
  circuitBreakerLastFailTime = 0
  isCircuitBreakerOpen = false

  // Reset logging flags
  loggedMissingConnection = false
  loggedInitialised = false
  loggedReuse = false
  loggedFallbackStatic = false
  loggedEmptyResults = false
  loggedHealthCheck = false
}
