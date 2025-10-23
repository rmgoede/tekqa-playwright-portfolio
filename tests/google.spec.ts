
// ✅ Basic test to verify Google homepage title

import { test, expect } from '@playwright/test';

test('Google homepage title contains "Google"', async ({ page }) => {
    await page.goto('https://www.google.com');
    await expect(page).toHaveTitle(/Google/);
});