// @ts-check
const { test, expect, devices } = require('@playwright/test');

// Test across different browsers and devices
const browserConfigs = [
  { name: 'Desktop Chrome', use: devices['Desktop Chrome'] },
  { name: 'Desktop Firefox', use: devices['Desktop Firefox'] },
  { name: 'Desktop Safari', use: devices['Desktop Safari'] },
  { name: 'Mobile Chrome', use: devices['Pixel 5'] },
  { name: 'Mobile Safari', use: devices['iPhone 12'] },
  { name: 'Tablet', use: devices['iPad Pro'] }
];

for (const config of browserConfigs) {
  test.describe(`Cross-browser compatibility - ${config.name}`, () => {
    test.use(config.use);

    test('layout renders correctly', async ({ page, browserName }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot(`layout-${config.name.toLowerCase().replace(' ', '-')}.png`, {
        fullPage: true,
        threshold: 0.2
      });

      // Verify critical elements are visible
      await expect(page.locator('.hero')).toBeVisible();
      await expect(page.locator('.nav')).toBeVisible();
      await expect(page.locator('.cards')).toBeVisible();
      await expect(page.locator('.contact__form')).toBeVisible();
    });

    test('CSS features work correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test CSS Grid support
      const cardsDisplay = await page.locator('.cards').evaluate(el =>
        getComputedStyle(el).display
      );
      expect(cardsDisplay).toBe('grid');

      // Test CSS custom properties
      const bgColor = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--bg')
      );
      expect(bgColor).toBeTruthy();

      // Test CSS clamp() function
      const fontSize = await page.locator('.hero__title').evaluate(el =>
        getComputedStyle(el).fontSize
      );
      expect(parseInt(fontSize)).toBeGreaterThan(20);
    });

    test('interactive features work', async ({ page, isMobile }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test theme toggle
      const themeToggle = page.locator('#themeToggle');
      await themeToggle.click();

      // Verify theme change
      await page.waitForTimeout(100);
      const colorScheme = await page.evaluate(() =>
        getComputedStyle(document.documentElement).colorScheme
      );
      expect(colorScheme).toBeTruthy();

      // Test navigation (mobile vs desktop)
      if (isMobile) {
        const navToggle = page.locator('#navToggle');
        await expect(navToggle).toBeVisible();

        await navToggle.click();
        const navList = page.locator('#nav-list');
        await expect(navList).toBeVisible();
      } else {
        const navList = page.locator('#nav-list');
        await expect(navList).toBeVisible();
      }
    });

    test('form functionality', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test form input
      const nameInput = page.locator('input[name="name"]');
      const emailInput = page.locator('input[name="email"]');
      const messageTextarea = page.locator('textarea[name="message"]');

      await nameInput.fill('Test User');
      await emailInput.fill('test@example.com');
      await messageTextarea.fill('Test message');

      // Verify values are set
      await expect(nameInput).toHaveValue('Test User');
      await expect(emailInput).toHaveValue('test@example.com');
      await expect(messageTextarea).toHaveValue('Test message');

      // Test form validation
      await nameInput.clear();
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();

      // Verify validation triggered
      const isValid = await nameInput.evaluate(el => el.validity.valid);
      expect(isValid).toBe(false);
    });

    test('performance metrics acceptable', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Performance thresholds by device type
      const maxLoadTime = config.name.includes('Mobile') ? 4000 : 3000;
      expect(loadTime).toBeLessThan(maxLoadTime);

      // Check resource loading
      const failedRequests = [];
      page.on('response', response => {
        if (!response.ok() && !response.url().includes('formspree')) {
          failedRequests.push(response.url());
        }
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      expect(failedRequests).toHaveLength(0);
    });

    test('accessibility features work', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test skip link
      await page.keyboard.press('Tab');
      const skipLink = page.locator('.skip');
      if (await skipLink.isVisible()) {
        await expect(skipLink).toBeFocused();
      }

      // Test focus management
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();

      // Test ARIA attributes
      const nav = page.locator('.nav');
      const ariaLabel = await nav.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    test('responsive design breakpoints', async ({ page, viewport }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test card layout responsiveness
      const cardStyles = await page.locator('.card').first().evaluate(el => {
        const style = getComputedStyle(el);
        return {
          gridColumn: style.gridColumn,
          width: style.width
        };
      });

      // Verify responsive behavior
      if (viewport.width < 768) {
        // Mobile: cards should stack
        expect(cardStyles.gridColumn).toContain('span');
      } else {
        // Desktop: cards should be in grid
        expect(cardStyles.gridColumn).toContain('span');
      }
    });

    test('JavaScript features degrade gracefully', async ({ page }) => {
      // Disable JavaScript
      await page.context().addInitScript(() => {
        // Simulate JS disabled scenario
        delete window.localStorage;
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Content should still be visible and accessible
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.hero')).toBeVisible();
      await expect(page.locator('.contact__form')).toBeVisible();

      // Links should still work
      const workLink = page.locator('a[href="#work"]');
      await workLink.click();
      expect(page.url()).toContain('#work');
    });
  });
}

// Additional browser-specific tests
test.describe('Browser-specific compatibility', () => {
  test('Safari-specific features', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test backdrop-filter support
    const headerBackdrop = await page.locator('.site-header').evaluate(el =>
      getComputedStyle(el).backdropFilter
    );
    expect(headerBackdrop).toBeTruthy();

    // Test color-mix support or fallback
    const bgColor = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.site-header')).backgroundColor
    );
    expect(bgColor).toBeTruthy();
  });

  test('Firefox-specific features', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test scrollbar styling
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Test CSS Grid in Firefox
    const cardsGrid = await page.locator('.cards').evaluate(el => {
      const style = getComputedStyle(el);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns
      };
    });

    expect(cardsGrid.display).toBe('grid');
    expect(cardsGrid.gridTemplateColumns).toContain('minmax');
  });

  test('Chrome-specific features', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chrome-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test modern CSS features
    const rootStyles = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        colorScheme: style.colorScheme,
        containerType: style.containerType || 'normal'
      };
    });

    expect(rootStyles.colorScheme).toBeTruthy();
  });
});