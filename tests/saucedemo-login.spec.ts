import { test, expect } from '@playwright/test';

test('SauceDemo login works', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Validate landing on the inventory page
  await expect(page.locator('.inventory_list')).toBeVisible();

  // Logout cleanup
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();

  // Confirm redirected to login page
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
