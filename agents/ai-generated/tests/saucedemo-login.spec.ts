import { test, expect } from '@playwright/test';
import { LoginPage } from './pom/LoginPage';
import { TEST_CREDENTIALS } from './test-data';

test.describe('Sauce Demo Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login with standard user', async ({ page }) => {
    await loginPage.login(
      TEST_CREDENTIALS.standardUser.username,
      TEST_CREDENTIALS.standardUser.password
    );
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('locked out user is prevented from logging in', async ({ page }) => {
    await loginPage.login(
      TEST_CREDENTIALS.lockedOutUser.username,
      TEST_CREDENTIALS.lockedOutUser.password
    );
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('invalid credentials show error message', async ({ page }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('do not match');
  });

  test('empty username shows error message', async ({ page }) => {
    await loginPage.login('', TEST_CREDENTIALS.standardUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});