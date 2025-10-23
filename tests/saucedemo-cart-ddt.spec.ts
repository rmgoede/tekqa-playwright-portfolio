// tests/saucedemo-cart-ddt.spec.ts

//This test was used to demonstrate data-driven testing (DDT) by adding multiple products to the cart from a dataset(saucedemo-products.json) and verifying their presence in the cart.
import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

type ProductRow = { name: string; addTestId: string };

test.describe('SauceDemo - data-driven add-to-cart', () => {
  test.setTimeout(90_000);

  test.describe('SauceDemo – data driven add-to-cart @DDT', () => {
    test('adds multiple products from dataset and verifies in cart', async ({ page }) => {
    // 1) Login
    await page.goto('https://www.saucedemo.com/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();

    // 2) Load dataset
    const file = path.join(process.cwd(), 'data', 'saucedemo-products.json');
    const rows: ProductRow[] = JSON.parse(await fs.readFile(file, 'utf-8'));

    // 3) Iterate products
    for (const row of rows) {
      await test.step(`Add "${row.name}" to cart`, async () => {
        // Add from inventory (each product has its own add-to-cart data-test id)
        await page.getByTestId(row.addTestId).click();
        await expect(page.locator('.shopping_cart_badge')).toBeVisible();

        // Go to cart
        await page.getByTestId('shopping-cart-link').click();
        await expect(page).toHaveURL(/cart\.html/);

        // Verify item shows in cart
        const item = page.locator('.cart_item').filter({ hasText: row.name });
        await expect(item).toBeVisible();

        // Return to inventory for next iteration
        await page.getByTestId('continue-shopping').click();
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(page.locator('.inventory_list')).toBeVisible();
      });
    }

    // 4) Logout (optional)
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });
});
    });
