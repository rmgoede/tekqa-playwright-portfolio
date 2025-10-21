// src/pages/LoginPage.ts
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  /** Go to site home (uses baseURL from playwright.config.ts). */
  async gotoHome() {
    await this.page.goto('/');
  }

  /** Open the login form and verify we’re on the right screen. */
  async openLogin() {
    await this.page.getByRole('link', { name: /^login$/i }).click();
    await expect(this.page.getByRole('heading', { name: /log in/i })).toBeVisible();
  }

  /**
   * Full login flow:
   *  - home -> open login
   *  - fill credentials
   *  - submit
   *  - wait for the account button (proof of auth)
   */
  async login(email: string, password: string) {
    await this.gotoHome();
    await this.openLogin();
    await this.page.getByRole('textbox', { name: /email/i }).fill(email);
    await this.page.getByRole('textbox', { name: /password/i }).fill(password);
    await this.page.getByRole('button', { name: /^continue$/i }).click();

    // ✅ Don’t return until the account button is visible
    await expect(
      this.page.getByRole('button', { name: /open user account menu/i })
    ).toBeVisible({ timeout: 10_000 });
  }
}
