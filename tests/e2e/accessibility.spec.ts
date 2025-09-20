import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('homepage passes WCAG 2.1 AA axe rules', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .include('.axiom-main')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('primary navigation exposes ARIA metadata', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const primaryNav = page.locator('nav[aria-label="Primary"]')
    await expect(primaryNav).toBeVisible()

    const toggle = page.locator('.theme-toggle')
    await expect(toggle).toHaveAttribute('aria-label', /Activate/i)
  })

  test('contact form inputs are labelled', async ({ page }) => {
    await page.goto('/#contact')
    await page.waitForLoadState('networkidle')

    const name = page.locator('#name')
    const email = page.locator('#email')
    const context = page.locator('#context')

    await expect(page.locator('label[for="name"]')).toBeVisible()
    await expect(page.locator('label[for="email"]')).toBeVisible()
    await expect(page.locator('label[for="context"]')).toBeVisible()

    const requiredStates = await Promise.all([
      name.evaluate(el => el.required),
      email.evaluate(el => el.required),
      context.evaluate(el => el.required)
    ])

    expect(requiredStates).toEqual([true, true, true])
  })
})
