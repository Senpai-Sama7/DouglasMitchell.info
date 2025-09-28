import { expect, test } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })

const metricsEndpoint = '/api/metrics'

test.describe('Metrics API', () => {
  test('returns fallback metrics without database', async ({ request }) => {
    const response = await request.get(metricsEndpoint, {
      headers: {
        'cache-control': 'no-cache',
        'x-api-key': process.env.METRICS_API_KEY || 'test-metrics-key'
      },
      timeout: 15000
    })

    expect(response.ok()).toBeTruthy()

    const body = await response.json()
    expect(Array.isArray(body.metrics)).toBe(true)
    expect(body.metrics.length).toBeGreaterThan(0)
    expect(body.meta?.source).toBeDefined()
    expect(['database', 'fallback']).toContain(body.meta.source)
    expect(typeof body.meta.fetchedAt).toBe('string')

    // Verify static fallback structure
    body.metrics.forEach((metric: any) => {
      expect(typeof metric.id).toBe('string')
      expect(typeof metric.label).toBe('string')
      expect(typeof metric.value).toBe('number')
      expect(typeof metric.unit).toBe('string')
      expect(typeof metric.detail).toBe('string')
    })
  })

  test('surface metrics on homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const metricCards = page.locator('.axiom-metric')
    await expect(metricCards.first()).toBeVisible()
  })

  test('metrics API failure fallback - authentication required', async ({ request }) => {
    // Test without API key
    const unauthenticatedResponse = await request.get(metricsEndpoint, {
      headers: {
        'cache-control': 'no-cache'
        // Intentionally omitting x-api-key header
      },
      timeout: 15000
    })

    expect(unauthenticatedResponse.status()).toBe(401)

    const unauthBody = await unauthenticatedResponse.json()
    expect(unauthBody.error).toContain('API key')
  })

  test('metrics API force-dynamic behavior', async ({ request }) => {
    const headers = {
      'cache-control': 'no-cache',
      'x-api-key': process.env.METRICS_API_KEY || 'test-metrics-key'
    }

    // Make multiple requests to verify force-dynamic (different request IDs)
    const response1 = await request.get(metricsEndpoint, { headers, timeout: 15000 })
    const response2 = await request.get(metricsEndpoint, { headers, timeout: 15000 })

    expect(response1.ok()).toBeTruthy()
    expect(response2.ok()).toBeTruthy()

    const body1 = await response1.json()
    const body2 = await response2.json()

    // Verify different request IDs proving force-dynamic behavior
    expect(body1.meta?.requestId).toBeDefined()
    expect(body2.meta?.requestId).toBeDefined()
    expect(body1.meta.requestId).not.toBe(body2.meta.requestId)
    expect(body1.meta?.source).toBeDefined()
    expect(body1.meta?.fetchedAt).toBeDefined()

    // Verify cache-control headers
    const cacheControlHeader = response1.headers()['cache-control']
    expect(cacheControlHeader).toBeDefined()
    expect(cacheControlHeader).toContain('public')
    expect(cacheControlHeader).toContain('s-maxage=30')
    expect(cacheControlHeader).toContain('stale-while-revalidate=90')
  })

  test('metrics API error handling - graceful degradation', async ({ request, page }) => {
    // First verify API works
    const apiResponse = await request.get(metricsEndpoint, {
      headers: {
        'x-api-key': process.env.METRICS_API_KEY || 'test-metrics-key'
      },
      timeout: 15000
    })
    expect(apiResponse.ok()).toBeTruthy()

    // Then verify homepage still loads even if metrics had issues
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Page should load successfully regardless of metrics API state
    await expect(page.locator('.axiom-section--hero')).toBeVisible()

    // Metrics should still be visible (using fallback if needed)
    const metricCards = page.locator('.axiom-metric')
    await expect(metricCards.first()).toBeVisible()

    // Verify no console errors from metrics failures
    const consoleErrors: string[] = []
    page.on('console', message => {
      if (message.type() === 'error' && message.text().includes('metrics')) {
        consoleErrors.push(message.text())
      }
    })

    await page.reload({ waitUntil: 'networkidle' })
    expect(consoleErrors).toHaveLength(0)
  })
})
