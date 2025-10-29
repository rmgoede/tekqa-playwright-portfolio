import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';
import { InventoryPage } from './pom/InventoryPage';
import { TEST_CREDENTIALS } from './test-data';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Sauce Demo Visual Tests', () => {
  const baselinePath = path.join(__dirname, '../artifacts/baseline-inventory-header.png');
  const latestPath = path.join(__dirname, '../artifacts/latest-inventory-header.png');

  test('inventory header matches baseline', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(
      TEST_CREDENTIALS.standardUser.username,
      TEST_CREDENTIALS.standardUser.password
    );

    // Ensure header is visible and stable
    await expect(inventoryPage.header).toBeVisible();

    const screenshot = await inventoryPage.header.screenshot();

    if (!fs.existsSync(baselinePath)) {
      // Create baseline if it doesn't exist
      await fs.promises.mkdir(path.dirname(baselinePath), { recursive: true });
      await fs.promises.writeFile(baselinePath, screenshot);
      test.skip('Created baseline image');
    } else {
      // Save latest screenshot
      await fs.promises.mkdir(path.dirname(latestPath), { recursive: true });
      await fs.promises.writeFile(latestPath, screenshot);

      // Compare with baseline
      const baseline = await fs.promises.readFile(baselinePath);
      expect(screenshot).toEqual(baseline);
    }
  });
});