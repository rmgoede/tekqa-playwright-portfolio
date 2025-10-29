# Sauce Demo — Test Implementation Task Checklist

Author: GitHub Copilot (automated planner)
Date: 2025-10-28

This checklist breaks the plan into actionable items for the test engineering team. Place implementation artifacts under the test tree (follow repo conventions) — but keep generated artifacts and work-in-progress in `agents/ai-generated` until ready for review.

1) Project setup and scaffolding
- [ ] Create test files skeletons:
  - `agents/ai-generated/tests/login.spec.ts` — Login happy + negative cases
  - `agents/ai-generated/tests/cart.spec.ts` — Add-to-cart flows and badge asserts
  - `agents/ai-generated/tests/checkout.spec.ts` — Checkout to completion
  - `agents/ai-generated/tests/visual-smoke.spec.ts` — Inventory header visual smoke
  - `agents/ai-generated/tests/api-sanitation.spec.ts` — Basic API sanity checks (attempt only if endpoints discovered)
  Estimate: 2–4 hours

2) Page Objects & fixtures
- [ ] Implement Page Objects under `agents/ai-generated/pages/` for: LoginPage, InventoryPage, CartPage, CheckoutPage. Centralize selectors (use `data-test` where available).
- [ ] Implement test fixtures for: `authFixture` (login helper), `checkoutData` (First/Last/Postal), and `testTimeouts` (custom timeouts for performance user).
  Estimate: 3–6 hours

3) Core tests implementation
- [ ] Implement Login tests (happy + negatives) using data-driven table for invalid permutations.
- [ ] Implement Add-to-cart tests with badge asserts and cart verification.
- [ ] Implement Checkout flow using fixed test data; assert final success message.
  Estimate: 4–8 hours

4) Visual smoke baseline
- [ ] Add `visual` helper to capture the header area and compare with baseline.
- [ ] Capture initial baseline on a known-good run; upload baseline to CI artifact storage and reference its path in the test.
  Estimate: 2–3 hours

5) API sanity check discovery and tests
- [ ] Run a small network sniff (locally) to discover XHR endpoints used by the site.
- [ ] If endpoint(s) present, implement lightweight request tests using Playwright `request` fixture.
  Estimate: 1–2 hours discovery + 1–2 hours tests (if available)

6) Flake mitigation & CI
- [ ] Add retries only in CI config for flaky tests (start with `retries: 1`).
- [ ] Add global test hooks to clear storage between tests.
- [ ] Disable or block flaky third-party resources in test runs (fonts/analytics) where possible.
- [ ] Configure artifact collection (screenshots/traces/HAR) on failure.
  Estimate: 2–4 hours

7) Acceptance and gating
- [ ] Wire PR check to run the critical subset: Login happy path, Checkout happy path, and visual smoke.
- [ ] Configure merge gate: block if any critical test fails or visual diff >2%.
  Estimate: 1–2 hours (CI edit + verification)

8) Documentation and handoff
- [ ] Add README in `agents/ai-generated/plans/` describing how to run the new tests locally and on CI.
- [ ] Provide a brief triage playbook for visual diffs and flaky tests.
  Estimate: 1–2 hours

9) Optional improvements (follow-up tasks)
- [ ] Expand visual suite to full inventory page and cart once baseline header is stable.
- [ ] Add cross-browser runs (Firefox) after stability.
- [ ] Add test data-driven coverage for many invalid credentials and edge-case postal codes.

Runbook / commands (local dev)
- Install dependencies (if not already):

```bash
# From repo root; adjust package manager if needed
npm ci
# or
pnpm install
```

- Run critical tests locally (Chromium):

```bash
npx playwright test agents/ai-generated/tests/login.spec.ts --project=chromium
```

- Run full suite locally:

```bash
npx playwright test agents/ai-generated/tests --project=chromium
```

Notes
- Keep all generated artifacts under `agents/ai-generated` until final review. Do not modify other repository folders per the plan instructions.
- When tests are stable, move them into the canonical `tests/` folder and update owners.

---

End of task checklist.
