import { expect, test } from '@playwright/test'

test.describe('Error handling', () => {
  test('does not emit console or page errors on load', async ({ page }) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []

    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text())
      }
    })

    page.on('pageerror', error => {
      pageErrors.push(error.message)
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(consoleErrors).toHaveLength(0)
    expect(pageErrors).toHaveLength(0)
  })
})
