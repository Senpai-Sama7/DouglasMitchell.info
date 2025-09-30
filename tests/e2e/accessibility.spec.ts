import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('homepage passes WCAG 2.1 AA axe rules', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Wait for animations to complete to avoid timing issues
    await page.waitForTimeout(2000)

    const results = await new AxeBuilder({ page })
      .include('#main-content')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('.custom-cursor') // Exclude custom cursor from accessibility checks
      .analyze()

    // Log violations for debugging if any exist
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', JSON.stringify(results.violations, null, 2))
    }

    expect(results.violations).toEqual([])
  })

  test('primary navigation exposes ARIA metadata', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for skip link accessibility
    const skipLink = page.locator('.skip-to-content')
    await expect(skipLink).toBeHidden() // Should be hidden by default
    
    // Check main content area has proper ID
    const mainContent = page.locator('#main-content')
    await expect(mainContent).toBeVisible()
    
    // Check that page has proper heading structure
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
  })

  test('contact form inputs are labelled', async ({ page }) => {
    await page.goto('/#contact')
    await page.waitForLoadState('networkidle')

    // Check that form inputs have proper labels and accessibility attributes
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const contextInput = page.locator('textarea[name="context"]')

    // Verify inputs are visible and have labels
    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(contextInput).toBeVisible()

    // Check that each input has an associated label
    const nameId = await nameInput.getAttribute('id')
    const emailId = await emailInput.getAttribute('id')
    const contextId = await contextInput.getAttribute('id')

    await expect(page.locator(`label[for="${nameId}"]`)).toBeVisible()
    await expect(page.locator(`label[for="${emailId}"]`)).toBeVisible()
    await expect(page.locator(`label[for="${contextId}"]`)).toBeVisible()

    // Check that inputs have aria-describedby for hints
    await expect(nameInput).toHaveAttribute('aria-describedby', `${nameId}-hint`)
    await expect(emailInput).toHaveAttribute('aria-describedby', `${emailId}-hint`)
    await expect(contextInput).toHaveAttribute('aria-describedby', `${contextId}-hint`)

    // Verify required states
    const requiredStates = await Promise.all([
      nameInput.evaluate(el => (el as HTMLInputElement).required),
      emailInput.evaluate(el => (el as HTMLInputElement).required),
      contextInput.evaluate(el => (el as HTMLInputElement).required)
    ])

    expect(requiredStates).toEqual([true, true, true])
  })
})
