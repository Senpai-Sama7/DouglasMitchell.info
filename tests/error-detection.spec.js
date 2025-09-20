// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Error Detection and Monitoring', () => {
  test('no JavaScript errors on page load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toHaveLength(0);
  });

  test('error monitoring system initializes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Load error monitoring
    await page.addScriptTag({ path: './lib/error-monitoring.js' });

    // Check if ErrorMonitor is available
    const hasErrorMonitor = await page.evaluate(() => {
      return typeof window.ErrorMonitor !== 'undefined';
    });

    expect(hasErrorMonitor).toBe(true);

    // Check health status
    const healthStatus = await page.evaluate(() => {
      return window.getHealthStatus();
    });

    expect(healthStatus.status).toBe('healthy');
  });

  test('handles network errors gracefully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Load error monitoring
    await page.addScriptTag({ path: './lib/error-monitoring.js' });

    // Simulate network error
    await page.route('**/api/test', route => route.abort());

    // Trigger a fetch request that will fail
    await page.evaluate(async () => {
      try {
        await fetch('/api/test');
      } catch (error) {
        // Expected to fail
      }
    });

    // Check if error was captured
    const errorReport = await page.evaluate(() => {
      return window.getErrorReport();
    });

    const networkErrors = errorReport.errors.filter(error => error.type === 'network');
    expect(networkErrors.length).toBeGreaterThan(0);
  });

  test('detects broken anchor links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Add a broken link temporarily
    await page.evaluate(() => {
      const link = document.createElement('a');
      link.href = '#nonexistent';
      link.textContent = 'Broken Link';
      link.id = 'test-broken-link';
      document.body.appendChild(link);
    });

    // Load error monitoring
    await page.addScriptTag({ path: './lib/error-monitoring.js' });

    // Click the broken link
    await page.click('#test-broken-link');

    // Wait for error detection
    await page.waitForTimeout(100);

    // Check if UX error was captured
    const errorReport = await page.evaluate(() => {
      return window.getErrorReport();
    });

    const uxErrors = errorReport.errors.filter(error => error.type === 'ux');
    expect(uxErrors.length).toBeGreaterThan(0);
  });

  test('monitors performance metrics', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Load error monitoring
    await page.addScriptTag({ path: './lib/error-monitoring.js' });

    // Wait for performance metrics to be collected
    await page.waitForTimeout(1000);

    const errorReport = await page.evaluate(() => {
      return window.getErrorReport();
    });

    // Check that performance metrics exist
    expect(errorReport.performance).toBeDefined();
    expect(typeof errorReport.performance.loadTime).toBe('number');
  });

  test('form validation error tracking', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Load error monitoring
    await page.addScriptTag({ path: './lib/error-monitoring.js' });

    // Try to submit form with invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');

    // Wait for validation
    await page.waitForTimeout(100);

    const errorReport = await page.evaluate(() => {
      return window.getErrorReport();
    });

    // Should capture form validation errors
    const formErrors = errorReport.errors.filter(error => error.type === 'form');
    expect(formErrors.length).toBeGreaterThan(0);
  });

  test('resource loading error detection', async ({ page }) => {
    // Block a CSS file to simulate loading error
    await page.route('**/styles.css', route => route.abort());

    const resourceErrors = [];
    page.on('pageerror', error => resourceErrors.push(error));

    await page.goto('/');

    // Load error monitoring
    await page.addScriptTag({ path: './lib/error-monitoring.js' });

    // Wait for error detection
    await page.waitForTimeout(500);

    const errorReport = await page.evaluate(() => {
      return window.getErrorReport();
    });

    // Should detect resource loading errors
    const resourceLoadErrors = errorReport.errors.filter(error => error.type === 'resource');
    expect(resourceLoadErrors.length).toBeGreaterThan(0);
  });

  test('theme toggle error detection', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Load error monitoring
    await page.addScriptTag({ path: './lib/error-monitoring.js' });

    // Test theme toggle functionality
    const themeToggle = page.locator('#themeToggle');
    await themeToggle.click();

    // Wait for theme change detection
    await page.waitForTimeout(200);

    const healthStatus = await page.evaluate(() => {
      return window.getHealthStatus();
    });

    // Theme should work without errors
    expect(healthStatus.status).toBe('healthy');
  });

  test('error reporting persistence', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Load error monitoring
    await page.addScriptTag({ path: './lib/error-monitoring.js' });

    // Generate a test error
    await page.evaluate(() => {
      window.ErrorMonitor.captureError({
        type: 'test',
        message: 'Test error for persistence',
        timestamp: Date.now()
      });
    });

    // Check if error is stored in localStorage
    const storedReports = await page.evaluate(() => {
      return localStorage.getItem('error-reports');
    });

    expect(storedReports).toBeTruthy();

    const reports = JSON.parse(storedReports);
    expect(reports.length).toBeGreaterThan(0);
    expect(reports[0].type).toBe('test');
  });

  test('error rate limiting', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Load error monitoring
    await page.addScriptTag({ path: './lib/error-monitoring.js' });

    // Generate many errors to test rate limiting
    await page.evaluate(() => {
      for (let i = 0; i < 100; i++) {
        window.ErrorMonitor.captureError({
          type: 'spam',
          message: `Spam error ${i}`,
          timestamp: Date.now()
        });
      }
    });

    const errorReport = await page.evaluate(() => {
      return window.getErrorReport();
    });

    // Should be limited to maxErrors (50)
    expect(errorReport.errors.length).toBeLessThanOrEqual(50);
  });
});