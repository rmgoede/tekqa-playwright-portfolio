import { test, expect } from '@playwright/test';

test('confirm generator can write', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});