import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import { projectMetrics } from '@/content/site-data'
import {
  __resetNeonClientForTests,
  getNeonClient,
  loadProjectMetrics
} from '@/lib/neon'

const originalDatabaseUrl = process.env.DATABASE_URL
const originalDatabaseUrlUnpooled = process.env.DATABASE_URL_UNPOOLED

beforeEach(() => {
  delete process.env.DATABASE_URL
  delete process.env.DATABASE_URL_UNPOOLED
  __resetNeonClientForTests()
})

afterEach(() => {
  if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL
  else process.env.DATABASE_URL = originalDatabaseUrl

  if (originalDatabaseUrlUnpooled === undefined) delete process.env.DATABASE_URL_UNPOOLED
  else process.env.DATABASE_URL_UNPOOLED = originalDatabaseUrlUnpooled

  __resetNeonClientForTests()
})

test('returns null client and fallback metrics when no connection string provided', async () => {
  const client = getNeonClient()
  assert.equal(client, null)

  const result = await loadProjectMetrics()
  assert.equal(result.source, 'fallback')
  assert.deepEqual(result.metrics, projectMetrics)
  assert.ok(result.fetchedAt)
})

test('prefers unpooled connection string and memoises client instance', () => {
  process.env.DATABASE_URL_UNPOOLED = 'postgresql://user:pass@localhost:5432/db'
  process.env.DATABASE_URL = 'postgresql://fallback-user@localhost:5432/db'

  const first = getNeonClient()
  assert.ok(first, 'expected neon client to be created when connection string is provided')

  const second = getNeonClient()
  assert.strictEqual(first, second)
})

test('falls back to pooled connection string when unpooled is absent', () => {
  delete process.env.DATABASE_URL_UNPOOLED
  process.env.DATABASE_URL = 'postgresql://pooled-user:secret@localhost:5432/db'

  const client = getNeonClient()
  assert.ok(client, 'expected neon client to be created from pooled connection string')
})

test('loadProjectMetrics with successful database response', async () => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb'

  try {
    const result = await loadProjectMetrics()
    assert.ok(result.metrics.length > 0, 'Should have at least one metric')
    result.metrics.forEach(metric => {
      assert.ok(typeof metric.id === 'string', 'Metric should have id')
      assert.ok(typeof metric.label === 'string', 'Metric should have label')
      assert.ok(typeof metric.value === 'number', 'Metric should have numeric value')
      assert.ok(typeof metric.unit === 'string', 'Metric should have unit')
      assert.ok(typeof metric.detail === 'string', 'Metric should have detail')
    })
    assert.ok(result.fetchedAt)
    assert.ok(['database', 'fallback'].includes(result.source))
  } catch (error) {
    const fallbackResult = await loadProjectMetrics()
    assert.equal(fallbackResult.source, 'fallback')
    assert.deepEqual(fallbackResult.metrics, projectMetrics, 'Should fallback to static metrics on database error')
  }
})

test('database error handling and graceful fallback', async () => {
  process.env.DATABASE_URL = 'postgresql://invalid:connection@nonexistent:5432/fake'

  const result = await loadProjectMetrics()

  assert.equal(result.source, 'fallback')
  assert.deepEqual(result.metrics, projectMetrics, 'Should return static metrics when database fails')
  assert.ok(result.metrics.length >= 3, 'Static fallback should have expected number of metrics')
})

test('neon client memoization behavior', () => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb'

  __resetNeonClientForTests()

  const client1 = getNeonClient()
  const client2 = getNeonClient()
  const client3 = getNeonClient()

  assert.ok(client1, 'First client should be created')
  assert.strictEqual(client1, client2, 'Second call should return same instance')
  assert.strictEqual(client1, client3, 'Third call should return same instance')

  __resetNeonClientForTests()
  const client4 = getNeonClient()

  assert.ok(client4, 'New client should be created after reset')
})
