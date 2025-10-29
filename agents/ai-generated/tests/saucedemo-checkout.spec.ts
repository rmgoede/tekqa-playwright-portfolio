import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';
import { InventoryPage } from './pom/InventoryPage';
import { CartPage } from './pom/CartPage';
import { CheckoutPage } from './pom/CheckoutPage';
import { TEST_CREDENTIALS, TEST_PRODUCTS, CHECKOUT_INFO } from './test-data';

test.describe('Sauce Demo Checkout', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(
      TEST_CREDENTIALS.standardUser.username,
      TEST_CREDENTIALS.standardUser.password
    );
  });

  test('complete checkout with single item', async () => {
    await inventoryPage.addToCart(TEST_PRODUCTS.backpack.dataTestId);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );

    await checkoutPage.completeCheckout();
    // Use a case-insensitive regex to match the completion header text robustly
    await expect(checkoutPage.completionMessage).toHaveText(/thank you/i);
  });

  test('checkout form validation', async () => {
    await inventoryPage.addToCart(TEST_PRODUCTS.backpack.dataTestId);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Try to continue without filling form
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');

    // Fill only first name
    await checkoutPage.firstNameInput.fill(CHECKOUT_INFO.firstName);
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessage).toBeVisible();
    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  });
});