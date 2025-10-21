// src/pages/ProfilePage.ts
import { Page, expect } from '@playwright/test';

export class ProfilePage {
  constructor(public page: Page) {}

  /** Verify profile page loaded */
  async expectLoaded() {
    await expect(this.page.getByRole('heading', { name: /welcome/i })).toBeVisible({ timeout: 10_000 });
    await expect(this.page.getByRole('textbox', { name: /first name/i })).toBeVisible({ timeout: 10_000 });
  }

  /** Verify we're on the correct profile URL */
  async expectProfileUrl() {
    await expect(this.page).toHaveURL(/\/account\/profile/i);
  }

  /** Verify user is logged out and back on public/home UI */
  async expectLoggedOut() {
    const loginUi = this.page.getByRole('link', { name: /^login$/i })
                     .or(this.page.getByRole('button', { name: /^login$/i }));
    await expect(loginUi).toBeVisible({ timeout: 10_000 });
    await expect(this.page).not.toHaveURL(/\/account\//i);
  }
}
