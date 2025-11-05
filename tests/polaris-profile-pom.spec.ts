// tests/polaris-profile-pom.spec.ts
// ---------------------------------------------------------
// Purpose
//   Demonstrates a complete, readable flow with POM & fixtures:
//     login → open account menu → go to My Profile → verify loaded (profile page and URL)
//
// How to run
//   Headed (Chromium):  npx playwright test tests/polaris-profile-pom.spec.ts --project=chromium --headed
//   With Inspector:     PWDEBUG=1 npx playwright test tests/polaris-profile-pom.spec.ts --project=chromium --headed
//
// Secrets
//   In .env, provide either pair:
//     POLARIS_EMAIL / POLARIS_PASSWORD   (or)
//     POLARIS_USER  / POLARIS_PASS
//
// Safari note
//   Polaris auth can be flaky in WebKit — we skip it by default.
// ---------------------------------------------------------

import { test, expect } from '../src/fixtures/base-fixtures';

test.describe('@private Polaris profile POM', () => {

test.skip(({ browserName }) => browserName === 'webkit', 'Polaris auth is flaky in WebKit right now.');

test('Polaris: login then open My Profile (POM) @POM', async ({ loginPage, accountMenu, profilePage }) => {
  // 1) Credentials (support either naming)
  const email =
    process.env.POLARIS_EMAIL ||
    process.env.POLARIS_USER ||
    '';

  const password =
    process.env.POLARIS_PASSWORD ||
    process.env.POLARIS_PASS ||
    '';

  // 2) Guardrail: skip if secrets missing (useful in CI)
  test.skip(!email || !password, 'POLARIS_EMAIL/POLARIS_PASSWORD (or POLARIS_USER/POLARIS_PASS) missing in .env');

await test.step('Login', async () => {
    await loginPage.login(email, password);
  });
  
  // 3) Flow
  await test.step('Open account menu and go to My Profile', async () => { // navigates, fills, submits, waits for account button
    await accountMenu.open();               // click user button, wait for [role="menu"]
    await accountMenu.goToMyProfile();      // click "My Profile" within the menu
    await profilePage.expectLoaded();       // heading + first name field visible
    await expect(profilePage.page).toHaveURL(/account\/profile/i);
  });
  

  await test.step('Logout and verify logged out', async () => {
    await accountMenu.logout();
    await profilePage.expectLoggedOut();
    });
  });
});
