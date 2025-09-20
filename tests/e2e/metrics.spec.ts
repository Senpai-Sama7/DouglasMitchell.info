import { expect, test } from '@playwright/test'

const metricsEndpoint = '/api/metrics'

test.describe('Metrics API', () => {
  test('returns fallback metrics without database', async ({ request }) => {
    const response = await request.get(metricsEndpoint, {
      headers: {
        'cache-control': 'no-cache'
      }
    })

    expect(response.ok()).toBeTruthy()

    const body = await response.json()
    expect(Array.isArray(body.metrics)).toBe(true)
    expect(body.metrics.length).toBeGreaterThan(0)
  })

  test('surface metrics on homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const metricCards = page.locator('.axiom-metric')
    await expect(metricCards.first()).toBeVisible()
  })
})
