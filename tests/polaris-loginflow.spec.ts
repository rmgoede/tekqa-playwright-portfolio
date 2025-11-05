import { test, expect } from '@playwright/test';

/*Quick notes:
Legacy end-to-end polaris login flow kept for compatibility, now using robust menu logic.

Handy run commands (most common in the wild):
Normal headed run:
--npx playwright test tests/polaris-loginflow.spec.ts --project=chromium --headed
With Inspector at a specific pause (await test.debug() if you add it temporarily):
--PWDEBUG=1 npx playwright test tests/polaris-loginflow.spec.ts --project=chromium --headed.  
*/
//--

test.describe('@private Polaris login flow', () => {

// Skip flaky WebKit runs until Polaris stabilizes there.
test.skip(({ browserName }) => browserName === 'webkit', 'Polaris auth is flaky in WebKit right now.');

test('Polaris: login flow happy path', async ({ page }) => {
  // 0) Credentials support (either env variable style)
  const email =
    process.env.POLARIS_EMAIL ||
    process.env.POLARIS_USER ||
    '';
  const password =
    process.env.POLARIS_PASSWORD ||
    process.env.POLARIS_PASS ||
    '';

  test.skip(!email || !password, 'Missing POLARIS_EMAIL/POLARIS_PASSWORD (or POLARIS_USER/POLARIS_PASS) in .env');

  // 1) Home
  await page.goto('/');

  // 2) Open Login
  await page.getByRole('link', { name: /^login$/i }).click();
  const loginHeading = page.getByRole('heading', { name: /log in/i });
  await expect(loginHeading).toBeVisible({ timeout: 15_000 });

  // 3) Fill credentials & submit
  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.getByRole('button', { name: /^continue$/i }).click();

  // 4) Wait for post-login navigation
  await page.waitForURL(/account/, { timeout: 15_000 });

  // ─────────────────────────────────────────────
  // Adaptive logic: new (dashboard) vs old (menu)
  // ─────────────────────────────────────────────
  if (await page.locator('text=/hey\s+ryan/i').isVisible({ timeout: 5_000 })) {
    console.log('✅ Landed directly on dashboard, skipping menu navigation.');

    // Basic verification that dashboard loaded
    await expect(page.getByRole('heading', { name: /hey ryan/i })).toBeVisible();
    await expect(page.getByText(/book an adventure/i)).toBeVisible();
  } else {
    console.log('🔄 Using menu-based navigation path.');
    
    // 5) Wait for account button
    const accountBtn = page.getByRole('button', { name: /open user account menu/i });
    await expect(accountBtn).toBeVisible({ timeout: 20_000 });
    await accountBtn.click();

    // 6) Wait for actual floating menu
    const menuPanel = page
      .locator(
        [
          '[role="menu"]',
          '[role="presentation"] [role="menu"]',
          '[id^="headlessui-menu-items-"] [role="menu"], [id^="headlessui-menu-items-"]'
        ].join(', ')
      )
      .first();
    await expect(menuPanel).toBeVisible({ timeout: 15_000 });

    // 7) Click "My Profile"
    const profileItem = menuPanel
      .locator('a[role="menuitem"][href*="/account/profile"]')
      .or(menuPanel.getByRole('menuitem', { name: /^my profile$/i }))
      .first();

    await expect(profileItem).toBeVisible({ timeout: 10_000 });
    await profileItem.click();

    // 8) Verify Profile Page
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('textbox', { name: /first name/i })).toBeVisible();
    await expect(page).toHaveURL(/account\/profile/i);
  }

  // ─────────────────────────────────────────────
  // 9) Optional Cleanup (Logout)
  // ─────────────────────────────────────────────
  try {
    const accountBtn = page.getByRole('button', { name: /open user account menu/i });
    if (await accountBtn.isVisible()) {
      await accountBtn.click();
      const logoutItem = page.getByRole('menuitem', { name: /^logout$/i }).first();
      if (await logoutItem.isVisible({ timeout: 5_000 })) {
        await logoutItem.click();
        await expect(page.getByRole('link', { name: /^login$/i })).toBeVisible({ timeout: 10_000 });
        console.log('✅ Logged out successfully.');
      }
    }
  } catch (err) {
    console.warn('⚠️ Logout skipped (menu not visible or already logged out).');
  }
  });
});
