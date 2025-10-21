import { expect, Page, Locator } from '@playwright/test';

export class AccountMenu {
  constructor(private page: Page) {}

  private get accountButton() {
    return this.page.getByRole('button', { name: /open user account menu/i });
  }

  /** Open the account menu (robust against attribute vs. panel timing). */
  async open() {
    const btn = this.accountButton;
    const panel = this.page.locator('[role="menu"]').first();

    // If it already looks open, bail fast.
    if (await panel.isVisible()) return;

    await btn.scrollIntoViewIfNeeded();
    await btn.click();

    // Wait until EITHER aria-expanded=true OR the menu panel is visible.
    if (!(await this.waitUntilMenuIsOpen(btn, panel, 8_000))) {
      // One gentle retry: click again and wait once more.
      await btn.click();
      const ok = await this.waitUntilMenuIsOpen(btn, panel, 8_000);
      expect(ok, 'Account menu should open after retry').toBeTruthy();
    }
  }

  /** Click “My Profile” inside the open menu. */
  async goToMyProfile() {
    const menuPanel = this.page.locator('[role="menu"]').first();
    const profileLink = menuPanel
      .locator('a[role="menuitem"][href*="/account/profile"]')
      .or(menuPanel.getByRole('menuitem', { name: /^my profile$/i }))
      .first();

    await expect(profileLink).toBeVisible({ timeout: 10_000 });
    await profileLink.click();
  }

  /** Logout via the menu and confirm the Login link appears again. */
  async logout() {
    await this.open();

    const menuPanel = this.page.locator('[role="menu"]').first();
    const logoutItem = menuPanel
      .locator('a[role="menuitem"][href*="/logout"]')
      .or(menuPanel.getByRole('menuitem', { name: /^logout$/i }))
      .first();

    await expect(logoutItem).toBeVisible({ timeout: 10_000 });
    await logoutItem.click();

    // Post-condition: back on a logged-out header
    await expect(
      this.page.getByRole('link', { name: /^login$/i })
    ).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Wait until the menu is considered open:
   * - either aria-expanded === "true" on the button
   * - or the [role="menu"] panel becomes visible
   *
   * Returns true if opened before timeout, false otherwise.
   */
  private async waitUntilMenuIsOpen(
    btn: Locator,
    panel: Locator,
    timeoutMs = 8_000
  ): Promise<boolean> {
    try {
      await expect
        .poll(
          async () => {
            const expanded = await btn.getAttribute('aria-expanded');
            const panelVisible = await panel.isVisible();
            return expanded === 'true' || panelVisible;
          },
          { timeout: timeoutMs, intervals: [100, 200, 300, 500] }
        )
        .toBeTruthy();
      return true;
    } catch {
      return false;
    }
  }
}
