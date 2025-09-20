import { neon } from '@neondatabase/serverless'
import { projectMetrics as fallbackMetrics } from '@/content/site-data'

type MetricRow = {
  id: string
  label: string
  value: number
  unit: string
  detail: string
}

export function getNeonClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.warn('DATABASE_URL not set; falling back to static metrics.')
    return null
  }
  try {
    return neon(connectionString)
  } catch (error) {
    console.warn('Failed to initialise Neon client:', error)
    return null
  }
}

export async function loadProjectMetrics() {
  const sql = getNeonClient()
  if (!sql) {
    return fallbackMetrics
  }

  try {
    const rows = (await sql`SELECT id, label, value, unit, detail FROM axiom_metrics ORDER BY label`) as MetricRow[]
    if (!rows?.length) {
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
    console.warn('Error querying Neon metrics; using fallback data.', error)
    return fallbackMetrics
  }
}
