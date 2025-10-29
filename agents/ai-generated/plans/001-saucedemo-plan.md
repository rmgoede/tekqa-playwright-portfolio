# Sauce Demo — Playwright Test Plan

Author: GitHub Copilot (automated test planner)
Date: 2025-10-28
Repository: tekqa-playwright-portfolio

## Executive summary

This document is a Playwright Test plan (no test code) for the Sauce Demo site (https://www.saucedemo.com). It defines the test scope, detailed scenarios, selector and test-data strategies, flake mitigations, visual smoke guidance, API sanity checks, and pass/fail gates. The goal is to validate core e-commerce flows end-to-end: login, add-to-cart, and checkout; maintain a single visual baseline for the inventory header; and run a small API sanity check if a backend endpoint is discoverable.

Assumptions
- Tests run against the production demo at https://www.saucedemo.com unless a staging environment is specified.
- The demo user accounts listed on the login page exist and credentials remain stable (observed: `standard_user` / `secret_sauce`).
- Tests start from a clean browser state (cookies/local storage cleared) unless a scenario explicitly seeds state.
- Test artifacts (screenshots, traces) will be saved to CI and local artifact directories as configured.

Scope
- Functional: Login, add-to-cart, cart validation, checkout to completion.
- Visual: One smoke baseline (inventory header) to detect major regressions.
- API: Basic sanity checks via Playwright Test's request capabilities if endpoints are available.
- Non-scope: Full visual regression suite across all pages, performance benchmarking beyond basic slow-user cases.

Environments and matrix
- Browsers: Chromium primary, Firefox secondary (optionally run Chromium only on PRs initially).
- Platforms: Desktop (1024x768 and 1366x768). Mobile flows out-of-scope for initial pass.
- CI: Run full suite on merge to `main`; quick subset (login + checkout happy path + visual smoke) on each PR.

## 1) Login — scenarios

Starting state (common to every login scenario): fresh browser, navigate to `https://www.saucedemo.com`.

1.1 Login — Happy path (standard_user)
- Steps:
  1. Enter `standard_user` into the Username field.
  2. Enter `secret_sauce` into the Password field.
  3. Click `Login` (or press Enter).
- Expected results:
  - Navigation to inventory page (URL contains `/inventory.html`).
  - Inventory list is visible and there are product tiles.
  - No visible error banner.
- Success criterion: The inventory page loads and at least one product is displayed.
- Failure conditions: Login button disabled, login form shows error, page does not reach `/inventory.html` within timeout.

1.2 Login — Negative: invalid username
- Steps:
  1. Enter `invalid_user` / `secret_sauce`.
  2. Click Login.
- Expected results:
  - Error message appears (non-empty error container) describing login failure.
  - Remains on login page.
- Edge cases: trailing/leading whitespace trimmed; assert exact error message if stable.

1.3 Login — Negative: invalid password
- Steps: `standard_user` / `wrong_password` then login.
- Expected: error message specific to credentials, no navigation.

1.4 Login — Negative: blank fields
- Steps: attempt login with blank username and/or blank password.
- Expected: either client-side validation (error) or general login error message.

1.5 Login — Locked out user (locked_out_user)
- Steps: `locked_out_user` / `secret_sauce` then login.
- Expected: Locked out error message appears and login is denied.

1.6 Login — Problem and performance users
- `problem_user` may render UI differently; `performance_glitch_user` may be slow.
- Tests:
  - `problem_user` smoke: ensure no blocking JS errors and product tiles are present.
  - `performance_glitch_user` resilience test: allow longer timeouts and assert functionality despite slow load.

Notes: mark `standard_user` happy path as critical. Negative cases are high priority. Use data-driven table for multiple username/password permutations.

## 2) Add-to-cart flow

Starting state: logged in as `standard_user`, on `/inventory.html` with product tiles visible.

2.1 Add multiple items — happy path
- Steps:
  1. Identify two distinct products (prefer using stable `data-test` attribute or product id selector).
  2. Click "Add to cart" for item A and item B.
  3. Assert header cart badge increments to `2`.
  4. Click cart icon to navigate to `/cart.html`.
  5. Assert both items appear in the cart list with correct names/prices.
- Expected results:
  - Cart badge displays `2` immediately after actions.
  - Cart page lists both items and quantities are correct.
- Failure conditions: badge miscount, missing item in cart, duplicate item entries.

2.2 Remove item from cart
- Steps: from `/cart.html` click `Remove` for item A.
- Expected: badge decrements to `1`; item A removed from cart list.

2.3 Edge cases
- Add the same item twice if UI supports quantity vs. duplicate buttons.
- Add beyond a hypothetical inventory cap (if any) and assert behavior.

## 3) Checkout flow to completion (fixed test data)

Starting state: logged in as `standard_user`, cart contains at least 1 item.

Fixed test data (use constants in fixtures):
- First name: Ryan
- Last name: Goede
- Postal code: 12345

3.1 Checkout — happy path
- Steps:
  1. From `/cart.html`, click `Checkout`.
  2. On `/checkout-step-one.html`, enter the fixed test data above.
  3. Click `Continue`.
  4. On `/checkout-step-two.html` assert items and summary; click `Finish`.
  5. On `/checkout-complete.html` assert presence of completion message (e.g., `THANK YOU FOR YOUR ORDER`).
- Expected results:
  - Correct totals shown in summary (if determinable) and items listed.
  - Completion page shows correct success message and no visible error.
- Success criterion: Order reaches `/checkout-complete.html` and success text is present.
- Failure conditions: form validation prevents continuing, summary missing, or final page not reached within timeout.

3.2 Checkout — negative: missing required fields
- Steps: attempt continue with blank First name / Last name / Postal code individually.
- Expected result: field-level validation or visible error prevents progress.

3.3 Data-driven variations
- Repeat checkout once with 3 items to ensure totals calculation and UI scale.

Notes: Keep checkout test as critical (blocking) since it validates full purchase pipeline.

## 4) Visual smoke — inventory header (single baseline)

Goal: detect major visual regressions to the critical navigation/header area quickly.

4.1 Baseline capture
- Target: inventory page header (site title + cart badge area). Example selector: `.app_logo` and `.shopping_cart_link` (or `#header_container` if present).
- Baseline image filename: `visual/inventory-header--baseline.png` saved under CI artifacts.
- Viewport: 1366x768 (desktop) and optionally 1024x768.
- Capture steps:
  1. Login as `standard_user` and navigate to `/inventory.html`.
  2. Wait for header selector to be visible and stable.
  3. Remove or hide non-deterministic elements (e.g., dynamic timestamps) via CSS before capture.
  4. Capture screenshot of header bounding rectangle and compare to baseline with pixel tolerance.
- Diff thresholds: Fail if pixel diff > 2% of image area OR any visual regression that overlaps core logo/cart area. Use a soft fail (warning) at 0.5–2% on PRs, hard fail on merge if >2%.
- Baseline maintenance: when accepted design changes occur, update baseline intentionally and annotate the change.

## 5) Basic API sanity

Observation & constraints
- The site is a demo; public REST API endpoints may not be documented or reachable. During exploratory phase (network sniffing), attempt to locate XHR/Fetch endpoints used by the site (inventory data, login session, cart endpoints).

Approach
- Use Playwright request (page.request or test.request) to probe likely endpoints discovered from devtools (e.g., `/inventory`, `/api`, or XHR calls seen on login).
- API sanity checks (if endpoints discovered):
  - GET inventory: returns 200 and non-empty JSON array with expected product fields (id, name, price).
  - POST login: with `standard_user`/`secret_sauce` returns 200 or redirect token.
  - If no API endpoints are discoverable, mark API tests as N/A and document the gap.

If API is available, make lightweight checks only (no heavy load). If not available, rely on UI for end-to-end verification and document the inability to do API checks.

## 6) Selector strategy, test data strategy, and flake mitigations

Selector strategy
- Prefer stable attributes: `data-test`, `data-qa`, `id` or `aria-*` where available. Example observed pattern on Sauce Demo: `data-test` attributes (e.g., `data-test="add-to-cart-sauce-labs-backpack"`).
- Use Page Object Model (POM): centralize selectors in `src/pages/*` Page Objects and export descriptive getters (e.g., `loginPage.username`, `inventoryPage.addToCart('sauce-labs-backpack')`). Keep selectors in one place so changes need one edit.
- Avoid brittle text-based selectors (e.g., relying on exact button text) unless stable. Prefer attribute-based selectors when available.
- For visual tests, use CSS selectors that target the minimal bounding container.

Test data strategy
- Credentials: store canonical test credentials in secured environment variables for CI and in a local `.env` for developers (documented); fallback to the publicly-known demo credentials in test code for local dev if allowed.
- Checkout data: use small, fixed fixture object inside test fixtures (e.g., {firstName: 'Ryan', lastName: 'Goede', postalCode: '12345'}).
- Data-driven tests: keep permutations in a CSV or JSON file if there are many combinations (e.g., invalid credentials list).
- Isolation: tests should create and clean their own state — clear cookies/localStorage between tests. Prefer the `test.use({ storageState: '...' })` approach for speed if a pre-authenticated state is safe.

Flake mitigations
- Timeouts & waits: Use explicit Playwright expect assertions (e.g., `await expect(locator).toBeVisible({timeout: X})`) rather than arbitrary sleeps. Increase timeouts for `performance_glitch_user` tests.
- Retries: enable reruns selectively in CI for flaky tests (e.g., `retries: 1` to start). Flag and fix tests that require retries.
- Network stability: mock or intercept flaky 3rd-party resources (analytics, fonts) or block them in CI to reduce flakiness.
- Animations: disable CSS animations/transitions globally in tests to reduce layout race conditions.
- Deterministic selectors: prefer attribute selectors; avoid relying on order of items unless stable.
- Test parallelism: ensure tests are independent (no shared cart state); use per-test isolation or per-worker storage state.
- Collect artifacts on failure: screenshot, trace, console logs, and network requests to diagnose flakiness.

## 7) Acceptance criteria and pass/fail gates

Test-level criteria
- Critical tests (Login happy path, Checkout happy path, Add-to-cart basics) must pass 100% on CI merge runs. Any failure blocks the merge.
- High priority negative tests and visual smoke must pass; a visual diff >2% must block merges until triaged.
- Non-critical tests (problem_user variations, extended edge cases) may be allowed to fail selectively but should be flagged.

Flake & stability gates
- If a single test flakes more than 3 times in a rolling week or exceeds a configured flakiness threshold (e.g., >5% reruns), create a bug and quarantine or fix the test.
- Use retries as a temporary mitigation only; investigate recurring flakiness.

Performance & timing expectations
- Individual critical test should complete under ~30s on CI environments; if significantly slower, investigate slow network/resource loads.

Artifact & observability gates
- On failure, tests must save: screenshot, full-page trace (where feasible), console logs, and network HAR/request logs. These must be accessible from the CI job artifacts.

Reporting & ownership
- Tests should be grouped into logical files (login.spec.ts, cart.spec.ts, checkout.spec.ts, visual.spec.ts). Each group should have a primary owner for maintenance.

## Test design details and templates (high level)

- Test contracts: each test should state input (user / test-data), primary assertions (URL, element visibility, badge count), and error modes (server 5xx, no response, assertion mismatch).
- Edge cases to consider in tests: empty lists (cart empty), slow resource loading, intermittent UI layout shifts, inconsistent badge update timing.

## Artifacts to collect
- On every failure: screenshot, trace (when available), console logs, network logs (HAR or request captures), and the test's full Playwright trace.
- Visual tests: store baseline PNGs within CI artifact storage and keep one canonical baseline per target viewport.

## Implementation notes (for the testing team)

- Create Page Objects and small, composable fixtures for login, item add/remove, and checkout data.
- Provide a small `visual` test helper that crops to the header and compares with a configurable pixel threshold. Keep the baseline in a versioned artifacts folder.
- Start with Chromium only for PR runs; add cross-browser runs after the suite stabilizes.

## Next steps
- Implement test skeletons and Page Objects.
- Create one visual baseline image for the inventory header and commit it to CI artifact storage (not in repo; store in CI or artifact server).
- Run the subset of critical tests in CI and iterate on flakiness mitigations.

---

End of plan.
