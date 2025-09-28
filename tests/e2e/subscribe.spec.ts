import { expect, test } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })

test.describe('Subscribe API E2E', () => {
  test('subscribe happy path - valid form submission', async ({ request, page }) => {
    // First, test the API directly
    const response = await request.post('/api/subscribe', {
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.SUBSCRIBE_API_KEY || 'test-key'
      },
      data: {
        email: 'test@example.com',
        name: 'E2E Test User',
        context: 'Testing the subscribe functionality with E2E automation suite'
      }
    })

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(201)

    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.message).toContain('Successfully subscribed')
    expect(body.meta.requestId).toBeDefined()
    expect(body.meta.durationMs).toBeGreaterThan(0)
  })

  test('subscribe form validation - client-side validation', async ({ page }) => {
    await page.goto('/#contact')
    await page.waitForLoadState('networkidle')

    // Test form presence
    await expect(page.locator('.axiom-form')).toBeVisible()

    // Test empty form submission
    await page.locator("button[type='submit']").click()

    // Check that name field is required
    const nameValidity = await page
      .locator('#name')
      .evaluate(element => (element as HTMLInputElement).validity.valid)
    expect(nameValidity).toBe(false)

    // Test invalid email
    await page.locator('#name').fill('Test User')
    await page.locator('#email').fill('invalid-email')
    await page.locator('#context').fill('This is a test message for E2E validation')

    const emailValidity = await page
      .locator('#email')
      .evaluate(element => (element as HTMLInputElement).validity.valid)
    expect(emailValidity).toBe(false)
  })

  test('subscribe rate limiting - exceeds limits', async ({ request }) => {
    const testHeaders = {
      'content-type': 'application/json',
      'x-api-key': process.env.SUBSCRIBE_API_KEY || 'test-key',
      'x-forwarded-for': '192.168.1.100' // Simulate specific IP for rate limiting
    }

    // Send 5 requests (the limit)
    for (let i = 0; i < 5; i++) {
      const response = await request.post('/api/subscribe', {
        headers: testHeaders,
        data: {
          email: `test${i}@ratetest.com`,
          name: `Rate Test User ${i}`,
          context: 'Testing rate limiting with multiple requests from same IP'
        }
      })

      if (i < 5) {
        expect(response.status()).toBe(201)
      }
    }

    // 6th request should be rate limited
    const rateLimitedResponse = await request.post('/api/subscribe', {
      headers: testHeaders,
      data: {
        email: 'rate-limited@test.com',
        name: 'Rate Limited User',
        context: 'This request should be rate limited'
      }
    })

    expect(rateLimitedResponse.status()).toBe(429)

    const rateLimitBody = await rateLimitedResponse.json()
    expect(rateLimitBody.success).toBe(false)
    expect(rateLimitBody.code).toBe('RATE_LIMIT_EXCEEDED')
    expect(rateLimitBody.error).toContain('Rate limit exceeded')
  })

  test('subscribe authentication - missing API key', async ({ request }) => {
    const response = await request.post('/api/subscribe', {
      headers: {
        'content-type': 'application/json'
        // Intentionally omitting x-api-key header
      },
      data: {
        email: 'test@example.com',
        name: 'Test User',
        context: 'Testing authentication failure'
      }
    })

    expect(response.status()).toBe(401)

    const body = await response.json()
    expect(body.error).toContain('API key')
  })

  test('subscribe validation errors - malformed data', async ({ request }) => {
    const response = await request.post('/api/subscribe', {
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.SUBSCRIBE_API_KEY || 'test-key'
      },
      data: {
        email: 'invalid-email-format',
        name: '', // Empty name should fail validation
        context: 'x' // Too short context should fail validation
      }
    })

    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body.success).toBe(false)
    expect(body.code).toBe('VALIDATION_ERROR')
    expect(body.details.errors).toBeDefined()
    expect(body.details.errors.length).toBeGreaterThan(0)
  })
})