// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Core Functionality Testing', () => {
  test('page loads successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check critical content is present
    await expect(page.locator('h1')).toContainText('Build less. Ship more.');
    await expect(page.locator('.lead')).toBeVisible();
  });

  test('navigation functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test navigation links
    const workLink = page.locator('a[href="#work"]');
    await workLink.click();
    await expect(page.locator('#work')).toBeInViewport();

    const aboutLink = page.locator('a[href="#about"]');
    await aboutLink.click();
    await expect(page.locator('#about')).toBeInViewport();

    const contactLink = page.locator('a[href="#contact"]');
    await contactLink.click();
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('mobile navigation toggle', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-specific test');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const navToggle = page.locator('#navToggle');
    const navList = page.locator('#nav-list');

    // Initially hidden
    await expect(navList).not.toBeVisible();

    // Click to open
    await navToggle.click();
    await expect(navList).toBeVisible();
    await expect(navToggle).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    await navToggle.click();
    await expect(navList).not.toBeVisible();
    await expect(navToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('theme toggle functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const themeToggle = page.locator('#themeToggle');
    await expect(themeToggle).toBeVisible();

    // Get initial theme
    const initialScheme = await page.evaluate(() =>
      getComputedStyle(document.documentElement).colorScheme
    );

    // Toggle theme
    await themeToggle.click();

    // Verify theme changed
    await page.waitForTimeout(100);
    const newScheme = await page.evaluate(() =>
      getComputedStyle(document.documentElement).colorScheme
    );

    expect(newScheme).not.toBe(initialScheme);

    // Verify localStorage is set
    const savedTheme = await page.evaluate(() =>
      localStorage.getItem('theme')
    );
    expect(savedTheme).toBeTruthy();
  });

  test('form functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Fill out form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');

    // Check form is ready for submission
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();

    // Verify form attributes
    const form = page.locator('.contact__form');
    await expect(form).toHaveAttribute('method', 'POST');
    await expect(form).toHaveAttribute('action', 'https://formspree.io/f/your-id');
  });

  test('scroll behavior and anchors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test smooth scrolling to sections
    const workButton = page.locator('a.btn[href="#work"]');
    await workButton.click();

    // Wait for scroll and check position
    await page.waitForTimeout(500);
    const workSection = page.locator('#work');
    await expect(workSection).toBeInViewport();
  });

  test('year display functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const yearElement = page.locator('#year');
    const currentYear = new Date().getFullYear().toString();
    await expect(yearElement).toContainText(currentYear);
  });

  test('error handling for missing elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that JavaScript doesn't break with missing elements
    const errors = [];
    page.on('pageerror', error => errors.push(error));
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Trigger theme toggle multiple times
    const themeToggle = page.locator('#themeToggle');
    await themeToggle.click();
    await themeToggle.click();

    // Trigger nav toggle if mobile
    const navToggle = page.locator('#navToggle');
    if (await navToggle.isVisible()) {
      await navToggle.click();
      await navToggle.click();
    }

    // No errors should have occurred
    expect(errors).toHaveLength(0);
  });

  test('performance and loading', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Page should load quickly (under 3 seconds)
    expect(loadTime).toBeLessThan(3000);

    // Check critical resources are loaded
    await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(1);
    await expect(page.locator('script[src="script.js"]')).toHaveCount(1);
  });
});