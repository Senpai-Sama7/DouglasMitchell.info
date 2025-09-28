import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import { NextRequest } from 'next/server'

let GET: (request: NextRequest) => Promise<Response>
let dynamic: string

beforeEach(async () => {
  process.env.METRICS_API_KEY = 'test-key'
  delete process.env.NEXT_PUBLIC_METRICS_API_KEY
  const metricsModule = await import('@/app/api/metrics/route')
  GET = metricsModule.GET
  dynamic = metricsModule.dynamic
})

afterEach(() => {
  delete process.env.METRICS_API_KEY
})

const buildRequest = (headers: Record<string, string> = {}) =>
  new NextRequest('http://localhost/api/metrics', {
    headers: new Headers(headers)
  })

test('exports dynamic mode as force-dynamic', () => {
  assert.equal(dynamic, 'force-dynamic')
})

test('rejects unauthenticated requests', async () => {
  const response = await GET(buildRequest())
  assert.equal(response.status, 401)
  const payload = await response.json()
  assert.equal(payload.code, 'API_KEY_REQUIRED')
})

test('returns metrics with enriched meta', async () => {
  const response = await GET(buildRequest({ 'x-api-key': 'test-key' }))
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Cache-Control'), 'public, s-maxage=30, stale-while-revalidate=90')

  const payload = await response.json()
  assert.ok(Array.isArray(payload.metrics))
  assert.ok(payload.metrics.length > 0)
  assert.ok(payload.meta)
  assert.equal(payload.meta.source === 'database' || payload.meta.source === 'fallback', true)
  assert.ok(typeof payload.meta.requestId === 'string')
  assert.ok(typeof payload.meta.fetchedAt === 'string')
})

test('invalid key returns 401', async () => {
  const response = await GET(buildRequest({ 'x-api-key': 'wrong' }))
  assert.equal(response.status, 401)
})
