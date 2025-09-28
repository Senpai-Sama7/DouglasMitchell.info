import assert from 'node:assert/strict'
import { afterEach, beforeEach, test } from 'node:test'
import { NextRequest } from 'next/server'

let POST: (request: NextRequest) => Promise<Response>
let dynamic: string

beforeEach(async () => {
  process.env.SUBSCRIBE_API_KEY = 'subscribe-key'
  delete process.env.UPSTASH_REDIS_REST_URL
  delete process.env.UPSTASH_REDIS_REST_TOKEN
  delete process.env.RESEND_API_KEY
  delete process.env.SUBSCRIBE_FORWARD_TO
  delete process.env.RESEND_TEST_RECIPIENT

  const subscribeRouteModule = await import('@/app/api/subscribe/route')
  POST = subscribeRouteModule.POST
  dynamic = subscribeRouteModule.dynamic
  const fallbackMap = (globalThis as any).__subscribeFallbackMap as Map<string, { count: number; resetTime: number }> | undefined
  fallbackMap?.clear()
})

afterEach(() => {
  delete process.env.SUBSCRIBE_API_KEY
  const fallbackMap = (globalThis as any).__subscribeFallbackMap as Map<string, { count: number; resetTime: number }> | undefined
  fallbackMap?.clear()
})

const buildRequest = (body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  new NextRequest('http://localhost/api/subscribe', {
    method: 'POST',
    headers: new Headers({ 'content-type': 'application/json', 'x-api-key': 'subscribe-key', ...headers }),
    body: JSON.stringify(body)
  })

test('exports dynamic mode as force-dynamic', () => {
  assert.equal(dynamic, 'force-dynamic')
})

test('rejects unauthenticated requests', async () => {
  const request = new NextRequest('http://localhost/api/subscribe', {
    method: 'POST',
    body: JSON.stringify({})
  })

  const response = await POST(request)
  assert.equal(response.status, 401)
})

test('validates payload shape', async () => {
  const response = await POST(
    buildRequest({
      email: 'user@example.com',
      name: '',
      context: 'Hi'
    })
  )

  assert.equal(response.status, 400)
  const body = await response.json()
  assert.equal(body.code, 'VALIDATION_ERROR')
})

test('accepts valid payload and returns 201', async () => {
  const response = await POST(
    buildRequest({
      email: 'user@example.com',
      name: 'Jordan Coder',
      context: 'I would like to hear more about your Axiom Protocol project.'
    })
  )

  assert.equal(response.status, 201)
  const body = await response.json()
  assert.equal(body.success, true)
  assert.ok(body.meta.requestId)
})

test('applies fallback rate limiting when Upstash is not configured', async () => {
  let lastResponse: Response | null = null
  for (let i = 0; i < 6; i += 1) {
    lastResponse = await POST(
      buildRequest({
        email: `user${i}@example.com`,
        name: 'Jordan Coder',
        context: 'Rate limit test payload with enough characters.'
      }, { 'x-forwarded-for': '203.0.113.10' })
    )
  }

  assert.ok(lastResponse)
  if (lastResponse) {
    const body = await lastResponse.json()
    assert.equal(lastResponse.status, 429)
    assert.equal(body.code, 'RATE_LIMIT_EXCEEDED')
  }
})
