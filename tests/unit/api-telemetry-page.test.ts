import assert from 'node:assert/strict'
import { test } from 'node:test'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/telemetry/page/route'
import { resetMetrics, getMetricsSnapshot } from '@/lib/metrics'

const buildRequest = (body: Record<string, unknown>) =>
  new NextRequest('http://localhost/api/telemetry/page', {
    method: 'POST',
    headers: new Headers({ 'content-type': 'application/json' }),
    body: JSON.stringify(body)
  })

test('records telemetry payloads', async () => {
  resetMetrics()

  const response = await POST(buildRequest({ metric: 'render_duration_ms', value: 120.5, page: 'home' }))
  assert.equal(response.status, 200)

  const snapshot = getMetricsSnapshot()
  const histogram = snapshot.histograms.find(h => h.name === 'page_render_duration_ms')
  assert.ok(histogram)
  assert.equal(histogram?.count, 1)
})

test('rejects invalid payloads', async () => {
  const response = await POST(buildRequest({ metric: 123, value: 'bad' }))
  assert.equal(response.status, 400)
})
