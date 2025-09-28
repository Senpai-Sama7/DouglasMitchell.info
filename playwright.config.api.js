// @ts-check
const { defineConfig } = require('@playwright/test');

/**
 * API-only test configuration for E2E tests without webServer startup
 * Uses existing dev server on port 3003
 */
module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['json', { outputFile: 'test-results/api-results.json' }]],
  use: {
    baseURL: 'http://localhost:3003',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api-tests',
      testMatch: ['subscribe.spec.ts', 'metrics.spec.ts'],
      use: { headless: true }
    }
  ]
});