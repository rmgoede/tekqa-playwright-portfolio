import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';
import { InventoryPage } from './pom/InventoryPage';
import { CartPage } from './pom/CartPage';
import { TEST_CREDENTIALS, TEST_PRODUCTS } from './test-data';

test.describe('Sauce Demo Cart', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(
      TEST_CREDENTIALS.standardUser.username,
      TEST_CREDENTIALS.standardUser.password
    );
  });

  test('add multiple items to cart', async () => {
    await inventoryPage.addToCart(TEST_PRODUCTS.backpack.dataTestId);
    await inventoryPage.addToCart(TEST_PRODUCTS.bikeLight.dataTestId);
    
    await expect(inventoryPage.cartBadge).toHaveText('2');
    
    await inventoryPage.goToCart();
    await expect(cartPage.getItemByName(TEST_PRODUCTS.backpack.name)).toBeVisible();
    await expect(cartPage.getItemByName(TEST_PRODUCTS.bikeLight.name)).toBeVisible();
  });

  test('remove item from cart', async () => {
    await inventoryPage.addToCart(TEST_PRODUCTS.backpack.dataTestId);
    await inventoryPage.addToCart(TEST_PRODUCTS.bikeLight.dataTestId);
    await inventoryPage.goToCart();

    await cartPage.removeItem('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(cartPage.getItemByName(TEST_PRODUCTS.backpack.name)).not.toBeVisible();
    await expect(cartPage.getItemByName(TEST_PRODUCTS.bikeLight.name)).toBeVisible();
  });
});