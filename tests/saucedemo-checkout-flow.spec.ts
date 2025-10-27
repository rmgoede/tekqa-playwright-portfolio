import { test, expect } from '@playwright/test';

test('User can complete a full checkout flow @smoke', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Login
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Add product to cart (stay on inventory page for simplest selectors)
  await expect(page).toHaveURL(/.*inventory.html/);
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // Go to cart (cart icon link)
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/.*cart.html/);

  // Begin checkout
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Enter checkout details
  await page.getByPlaceholder('First Name').fill('Ryan');
  await page.getByPlaceholder('Last Name').fill('Goede');
  await page.getByPlaceholder('Zip/Postal Code').fill('55330');
  await page.getByRole('button', { name: 'Continue' }).click();

  // Finish order
  await page.getByRole('button', { name: 'Finish' }).click();

  // Assert success
  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});
