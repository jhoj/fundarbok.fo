import { test as base, expect } from '@playwright/test';

export const testData = {
  secretary: {
    email: 'secretary@fundarbok.fo',
    password: 'password123',
    role: 'Secretary',
  },
  member: {
    email: 'jens@fundarbok.fo',
    password: 'password123',
    role: 'CommitteeMember',
  },
};

export async function loginAsSecretary(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', testData.secretary.email);
  await page.fill('input[type="password"]', testData.secretary.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard', { timeout: 10000 });
}

export async function loginAsMember(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', testData.member.email);
  await page.fill('input[type="password"]', testData.member.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard', { timeout: 10000 });
}

export async function logout(page) {
  try {
    await page.click('[data-testid="user-menu"], button:has(mat-icon)');
    await page.click('button[type="button"] >> text=/Útskrá|Logout/');
  } catch {
    // If logout fails, just navigate to login
  }
  await page.goto('/login');
}

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await loginAsSecretary(page);
    await use(page);
    await logout(page);
  },
});
