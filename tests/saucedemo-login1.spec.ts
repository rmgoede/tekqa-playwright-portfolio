import { test, expect } from '@playwright/test';

// Some Notes…
// How to use it:
// Uncomment one await test.debug() where needed
// Run headed:
// npx playwright test tests/saucedemo-login1.spec.ts --headed
// The Inspector opens at that line; hit Resume when done. It auto-closes at test end.
// PWDEBUG=1 also works for full session debugging but is slower.

test('login lands on inventory, add backpack to cart, then logout', async ({ page }) => {
  // Login
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  // await test.debug(); // 👈 Toggle ON to inspect pre-click state (username/password filled)
  await page.click('[data-test="login-button"]');

  // Landed on inventory page
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();

  // Backpack CTA is present
  await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();

  // await test.debug(); // 👈 Toggle ON to pause before adding to cart
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Go to cart
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/cart\.html/);

  // Cart contains the backpack
  const cartItem = page.locator('.cart_item').first();
  await expect(cartItem).toBeVisible();
  await expect(cartItem.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');

  // Logout cleanup (hamburger menu -> Logout)
  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});
