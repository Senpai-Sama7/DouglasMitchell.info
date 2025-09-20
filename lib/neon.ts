import { neon } from '@neondatabase/serverless'
import { projectMetrics as fallbackMetrics } from '@/content/site-data'
import { getLogger } from '@/lib/log'

type MetricRow = {
  id: string
  label: string
  value: number
  unit: string
  detail: string
}

const logger = getLogger('neon')

let loggedMissingConnection = false
let loggedFallbackStatic = false
let loggedEmptyResults = false

export function getNeonClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    if (!loggedMissingConnection) {
      logger.warn({ event: 'neon.connection.missing', message: 'DATABASE_URL not set; falling back to static metrics.' })
      loggedMissingConnection = true
    }
    return null
  }
  try {
    return neon(connectionString)
  } catch (error) {
    if (!loggedMissingConnection) {
      logger.warn({ event: 'neon.connection.error', message: 'Failed to initialise Neon client', error })
      loggedMissingConnection = true
    }
    return null
  }
}

export async function loadProjectMetrics() {
  const sql = getNeonClient()
  if (!sql) {
    if (!loggedFallbackStatic) {
      logger.info({ event: 'metrics.fallback.static', message: 'Serving static metrics fallback' })
      loggedFallbackStatic = true
    }
    return fallbackMetrics
  }

  try {
    const rows = (await sql`SELECT id, label, value, unit, detail FROM axiom_metrics ORDER BY label`) as MetricRow[]
    if (!rows?.length) {
      if (!loggedEmptyResults) {
        logger.warn({ event: 'metrics.query.empty', message: 'Neon metrics table empty, using fallback data' })
        loggedEmptyResults = true
      }
      return fallbackMetrics
    }

    return rows.map(row => ({
      id: row.id,
      label: row.label,
      value: Number(row.value),
      unit: row.unit,
      detail: row.detail
    }))
  } catch (error) {
    logger.error({ event: 'metrics.query.error', message: 'Error querying Neon metrics; using fallback data.', error })
    return fallbackMetrics
  }
}
