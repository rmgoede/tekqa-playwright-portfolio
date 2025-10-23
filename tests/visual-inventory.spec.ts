import { test, expect } from '@playwright/test';


// This test verifies the visual appearance of the inventory header on saucedemo.com from a snapshot perspective.

//visual regression test for saucedemo inventory header
//run---->npx playwright test tests/visual-inventory.spec.ts --project=chromium
//If the header layout, font, or color shifts even slightly, the test will fail and produce a side-by-side diff in the HTML report.
//npx playwright test tests/visual-inventory.spec.ts --project=chromium --update-snapshots

test.describe('SauceDemo – visual smoke', () => {
  // Pin visuals to a consistent render size + scale
  test.use({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });

  test('inventory header looks right', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);

    const header = page.locator('.primary_header, header');
    await expect(header).toBeVisible();

    await expect(header).toHaveScreenshot('inventory-header.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
      // masks hide dynamic bits like the cart badge count
      mask: [page.locator('.shopping_cart_badge')]
    });
  });
});
