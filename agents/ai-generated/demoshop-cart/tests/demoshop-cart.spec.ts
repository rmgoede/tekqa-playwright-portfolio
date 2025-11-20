import { test, expect } from '@playwright/test';
import cartCases from '../data/cart-cases.json';

type CartCase = {
  name: string;
  items: string[];
};

// Known prices from SauceDemo inventory
const priceMap: Record<string, number> = {
  'Sauce Labs Backpack': 29.99,
  'Sauce Labs Bike Light': 9.99,
  'Sauce Labs Bolt T-Shirt': 15.99,
  'Sauce Labs Fleece Jacket': 49.99,
  'Sauce Labs Onesie': 7.99,
  'Test.allTheThings() T-Shirt (Red)': 15.99,
};

test.describe('@ai @ddt DemoShop Cart & Totals', () => {
  for (const cartCase of cartCases as CartCase[]) {
    test(`validates cart totals for scenario: ${cartCase.name}`, async ({ page }) => {
      // 1️⃣ Login
      await page.goto('https://www.saucedemo.com/');
      await page.getByPlaceholder('Username').fill('standard_user');
      await page.getByPlaceholder('Password').fill('secret_sauce');
      await page.getByRole('button', { name: 'Login' }).click();

      // 2️⃣ Add each requested item from the inventory page
      for (const itemName of cartCase.items) {
        const itemCard = page.locator('.inventory_item').filter({ hasText: itemName });

        await expect(itemCard, `Inventory card for "${itemName}" should be visible`).toBeVisible();

        await itemCard
          .getByRole('button', { name: /add to cart/i })
          .click();
      }

      // 3️⃣ Go to the cart and verify item count
      const cartLink = page.locator('[data-test="shopping-cart-link"], .shopping_cart_link');
      await cartLink.click();
      await expect(page).toHaveURL(/cart\.html/);

      const cartItems = page.locator('.cart_item');
      await expect(cartItems).toHaveCount(cartCase.items.length);

      // 4️⃣ Start checkout
      await page.getByRole('button', { name: 'Checkout' }).click();
      await expect(page).toHaveURL(/checkout-step-one\.html/);

      // 5️⃣ Fill checkout info (dummy data) and continue
      await page.getByPlaceholder('First Name').fill('Ryan');
      await page.getByPlaceholder('Last Name').fill('Goede');
      await page.getByPlaceholder('Zip/Postal Code').fill('55330');
      await page.getByRole('button', { name: 'Continue' }).click();

      // 6️⃣ On the overview page, verify the item total
      await expect(page).toHaveURL(/checkout-step-two\.html/);

      const expectedSubtotal = cartCase.items.reduce(
        (sum, itemName) => sum + priceMap[itemName],
        0
      );

      const itemTotalText = await page.locator('[data-test="subtotal-label"]').textContent();
      // Example: "Item total: $39.98"
      const match = itemTotalText?.match(/Item total:\s*\$(\d+\.\d{2})/);

      expect(match, 'Item total text should contain a currency value').not.toBeNull();

      const actualSubtotal = Number(match![1]);

      expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);
    });
  }
});