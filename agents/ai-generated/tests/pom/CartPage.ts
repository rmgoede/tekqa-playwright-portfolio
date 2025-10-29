import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('.cart_item');
  }

  async removeItem(dataTestId: string) {
    await this.page.locator(`[data-test="remove-${dataTestId}"]`).click();
  }

  getItemByName(name: string) {
    return this.page.locator('.cart_item').filter({ hasText: name });
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}