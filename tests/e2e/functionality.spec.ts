import { expect, test } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })

test.describe('Core functionality', () => {
  test('renders hero and navigation without console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.axiom-section--hero')).toBeVisible()
    await expect(page.locator('.axiom-nav')).toBeVisible()
    await expect(page.locator('.axiom-hero__headline')).toContainText('Build less. Ship more.')

    expect(consoleErrors).toHaveLength(0)
  })

  test('theme toggle persists selection', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme ?? '')

    await page.locator('.theme-toggle').click()
    await page.waitForTimeout(120)

    const updatedTheme = await page.evaluate(() => document.documentElement.dataset.theme ?? '')
    expect(updatedTheme).not.toBe(initialTheme)

    await page.reload({ waitUntil: 'networkidle' })
    const restoredTheme = await page.evaluate(() => document.documentElement.dataset.theme ?? '')
    expect(restoredTheme).toBe(updatedTheme)
  })

  test('mobile navigation toggle controls menu visibility', async ({ page }, testInfo) => {
    if (!/Mobile/.test(testInfo.project.name)) {
      test.skip()
    }

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const navLinks = page.locator('.axiom-nav__links')
    const toggle = page.locator('.axiom-nav__toggle')

    await expect(navLinks).toBeHidden()

    await toggle.click()

    await expect(navLinks).toBeVisible()

    const overflowOpen = await page.evaluate(() => document.body.style.overflow)
    expect(overflowOpen).toBe('hidden')

    await toggle.click()

    await expect(navLinks).toBeHidden()

    const overflowClosed = await page.evaluate(() => document.body.style.overflow)
    expect(overflowClosed === '' || overflowClosed === 'visible').toBe(true)
  })

  test('project navigation renders slugged detail view', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.locator("a[href='/projects/ultimate-ai-agent']").first().click()
    await page.waitForURL('**/projects/ultimate-ai-agent')

    await expect(page.locator('main h1')).toContainText('Ultimate AI Agent')
    await expect(page.locator('.project-detail__badge')).toContainText('AI & Systems Architecture')
  })

  test('contact form enforces validation', async ({ page }) => {
    await page.goto('/#contact')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('.axiom-form')).toBeVisible()

    await page.locator('#name').fill('')
    await page.locator('#email').fill('invalid-email')
    await page.locator('#context').fill('Test message')
    await page.locator("button[type='submit']").click()

    const emailValidity = await page
      .locator('#email')
      .evaluate(element => (element as HTMLInputElement).validity.valid)
    expect(emailValidity).toBe(false)
  })
})
