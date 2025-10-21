// src/fixtures/base-fixtures.ts
// ---------------------------------------------------------
// Purpose
//   Provide typed, reusable fixtures so tests can request
//   { loginPage, accountMenu, profilePage } directly.
//
// Usage
//   import { test, expect } from '../src/fixtures/base-fixtures';
//   test('example', async ({ loginPage, accountMenu, profilePage }) => { ... });
//
// Notes
//   - We re-export Playwright's "expect" for convenience.
//   - No global state is stored; each test receives fresh instances.
// ---------------------------------------------------------

import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountMenu } from '../pages/AccountMenu';
import { ProfilePage } from '../pages/ProfilePage';

type Fixtures = {
  loginPage: LoginPage;
  accountMenu: AccountMenu;
  profilePage: ProfilePage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountMenu: async ({ page }, use) => {
    await use(new AccountMenu(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
});

export { expect };
