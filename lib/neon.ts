import { neon } from '@neondatabase/serverless'
import { projectMetrics as fallbackMetrics } from '@/content/site-data'
import { getLogger } from '@/lib/log'

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

let memoizedClient: ReturnType<typeof neon> | null | undefined
let loggedMissingConnection = false
let loggedInitialised = false
let loggedReuse = false
let loggedFallbackStatic = false
let loggedEmptyResults = false

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

export function getNeonClient() {
  if (memoizedClient !== undefined) {
    if (memoizedClient && !loggedReuse) {
      logger.debug({ event: 'neon.connection.reuse', message: 'Reusing existing Neon client instance.' })
      loggedReuse = true
    }
    return memoizedClient
  }

  const resolved = resolveConnectionString()
  if (!resolved) {
    if (!loggedMissingConnection) {
      logger.warn({ event: 'neon.connection.missing', message: 'No Neon connection string provided; falling back to static metrics.' })
      loggedMissingConnection = true
    }
    memoizedClient = null
    return memoizedClient
  }

  const { connectionString, mode } = resolved

  try {
    memoizedClient = neon(connectionString)
    if (!loggedInitialised) {
      logger.info({ event: 'neon.connection.initialised', message: `Neon client initialised (${mode})`, mode })
      loggedInitialised = true
    }
    return memoizedClient
  } catch (error) {
    if (!loggedMissingConnection) {
      logger.warn({ event: 'neon.connection.error', message: 'Failed to initialise Neon client', error })
      loggedMissingConnection = true
    }
    memoizedClient = null
    return memoizedClient
  }
}

function wrapResult(metrics: ProjectMetric[], source: 'database' | 'fallback'): LoadMetricsResult {
  return {
    metrics,
    source,
    fetchedAt: new Date().toISOString()
  }
}

export async function loadProjectMetrics(): Promise<LoadMetricsResult> {
  const sql = getNeonClient()
  if (!sql) {
    if (!loggedFallbackStatic) {
      logger.info({ event: 'metrics.fallback.static', message: 'Serving static metrics fallback' })
      loggedFallbackStatic = true
    }
    return wrapResult(fallbackMetrics, 'fallback')
  }

  try {
    const rows = (await sql`SELECT id, label, value, unit, detail, recorded_at FROM axiom_metrics ORDER BY recorded_at DESC`) as (MetricRow & { recorded_at?: Date | string | null })[]

    if (!rows?.length) {
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

    return wrapResult(metrics, 'database')
  } catch (error) {
    logger.error({ event: 'metrics.query.error', message: 'Error querying Neon metrics; using fallback data.', error })
    return wrapResult(fallbackMetrics, 'fallback')
  }
}

export function __resetNeonClientForTests() {
  memoizedClient = undefined
  loggedMissingConnection = false
  loggedInitialised = false
  loggedReuse = false
  loggedFallbackStatic = false
  loggedEmptyResults = false
}
