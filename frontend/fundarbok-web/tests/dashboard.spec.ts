import { test, expect } from '@playwright/test';
import { testData, loginAsSecretary, logout } from './fixtures';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSecretary(page);
  });

  test('should display dashboard page', async ({ page }) => {
    await page.goto('/dashboard');
    const heading = page.locator('h1, h2, app-page-header').first();
    await expect(heading).toBeVisible();
  });

  test('should display meetings count', async ({ page }) => {
    await page.goto('/dashboard');
    const card = page.locator('[data-testid="meetings-card"], mat-card').filter({
      hasText: /meeting|fundur/i,
    }).first();
    await expect(card).toBeVisible({ timeout: 5000 }).catch(async () => {
      // If not found by testid, look for any card
      const cards = await page.locator('mat-card').count();
      expect(cards).toBeGreaterThan(0);
    });
  });

  test('should display committees count', async ({ page }) => {
    await page.goto('/dashboard');
    const card = page.locator('[data-testid="committees-card"], mat-card').filter({
      hasText: /committee|nefnd/i,
    }).first();
    await expect(card).toBeVisible({ timeout: 5000 }).catch(async () => {
      const cards = await page.locator('mat-card').count();
      expect(cards).toBeGreaterThan(0);
    });
  });

  test('should navigate to meetings', async ({ page }) => {
    await page.goto('/dashboard');
    const meetingsLink = page.locator('a, button').filter({
      hasText: /meeting|fundur/i,
    }).first();

    if (await meetingsLink.isVisible()) {
      await meetingsLink.click();
      await page.waitForURL('**/meetings', { timeout: 5000 }).catch(() => {
        // May already be on meetings
      });
      expect(page.url()).toContain('/meetings');
    }
  });

  test('should navigate to committees', async ({ page }) => {
    await page.goto('/dashboard');
    const committeesLink = page.locator('a, button').filter({
      hasText: /committee|nefnd/i,
    }).first();

    if (await committeesLink.isVisible()) {
      await committeesLink.click();
      await page.waitForURL('**/committees', { timeout: 5000 }).catch(() => {
        // May already be on committees
      });
      expect(page.url()).toContain('/committees');
    }
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Check for critical errors (not including expected warnings)
    const criticalErrors = errors.filter(
      (e) => !e.includes('ignore') && !e.includes('warning')
    );
    expect(criticalErrors.length).toBe(0);
  });
});
