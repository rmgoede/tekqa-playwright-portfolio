import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';

test.describe('Sauce Demo Visual Tests', () => {
  test('inventory header matches baseline', async ({ page, browserName }) => {
    // Keep visuals stable (only run this visual on Chromium)
    test.skip(browserName !== 'chromium');

    const loginPage = new LoginPage(page);
    await loginPage.gotoHome();
    await loginPage.login('standard_user', 'secret_sauce');

    const header = page.locator('.header_secondary_container');
    await expect(header).toBeVisible();

    // Use Playwright snapshot API instead of manual byte-compare
    await expect(header).toHaveScreenshot('inventory-header.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
      // If the badge can change, un-comment to mask it:
      // mask: [page.locator('.shopping_cart_badge')],
    });
  });
});
