// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility Testing', () => {
  test('homepage accessibility compliance', async ({ page }) => {
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip:focus');
    await expect(skipLink).toBeVisible();

    // Test navigation focus
    await page.keyboard.press('Tab');
    const firstNavItem = page.locator('.nav a:first-child');
    await expect(firstNavItem).toBeFocused();

    // Test theme toggle
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const themeToggle = page.locator('#themeToggle');
    await expect(themeToggle).toBeFocused();
  });

  test('ARIA attributes and roles', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check navigation ARIA
    const nav = page.locator('.nav');
    await expect(nav).toHaveAttribute('aria-label');

    // Check menu button ARIA
    const menuButton = page.locator('#navToggle');
    await expect(menuButton).toHaveAttribute('aria-expanded');
    await expect(menuButton).toHaveAttribute('aria-controls');

    // Check theme button ARIA
    const themeButton = page.locator('#themeToggle');
    await expect(themeButton).toHaveAttribute('aria-label');
  });

  test('color contrast requirements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test color contrast with axe
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('.hero, .nav, .card')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations
      .filter(violation => violation.id === 'color-contrast');

    expect(contrastViolations).toHaveLength(0);
  });

  test('form accessibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check form labels
    const nameInput = page.locator('input[name="name"]');
    const nameLabel = page.locator('label').filter({ hasText: 'Name' });
    await expect(nameLabel).toBeVisible();

    const emailInput = page.locator('input[name="email"]');
    const emailLabel = page.locator('label').filter({ hasText: 'Email' });
    await expect(emailLabel).toBeVisible();

    const messageTextarea = page.locator('textarea[name="message"]');
    const messageLabel = page.locator('label').filter({ hasText: 'Message' });
    await expect(messageLabel).toBeVisible();

    // Test required attributes
    await expect(nameInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('required');
    await expect(messageTextarea).toHaveAttribute('required');
  });

  test('mobile accessibility', async ({ page, browserName, isMobile }) => {
    test.skip(!isMobile, 'Mobile-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test mobile navigation
    const navToggle = page.locator('#navToggle');
    await expect(navToggle).toBeVisible();

    // Test mobile navigation interaction
    await navToggle.click();
    const navList = page.locator('#nav-list');
    await expect(navList).toBeVisible();

    // Run accessibility scan on mobile nav
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('.nav')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});