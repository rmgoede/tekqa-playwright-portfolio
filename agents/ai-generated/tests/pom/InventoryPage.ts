import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly header: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('.header_secondary_container');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  addToCart(dataTestId: string) {
    return this.page.locator(`[data-test="${dataTestId}"]`).click();
  }

  async getCartCount(): Promise<number> {
    const badge = await this.cartBadge.textContent();
    return badge ? parseInt(badge, 10) : 0;
  }

  async goToCart() {
    await this.cartLink.click();
  }
}