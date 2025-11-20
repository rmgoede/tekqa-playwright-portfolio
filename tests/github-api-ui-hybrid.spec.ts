import { test, expect } from '@playwright/test';

/**
 * GitHub: API repo data matches UI for microsoft/playwright
 *
 * What this test proves
 * ---------------------
 * 1) Calls the GitHub REST API to fetch canonical repo data (owner/name/description).
 * 2) Opens the public repo page in the browser.
 * 3) Asserts the <h1> header shows "microsoft / playwright".
 * 4) Reads the page's meta description (SEO source of truth on many sites).
 * 5) Compares API description vs UI description with a tolerant strategy:
 *    - exact match OR
 *    - UI contains API string OR
 *    - "enough" token overlap (handles punctuation, ellipses, truncation)
 *
 * Why the tolerant strategy?
 * --------------------------
 * GitHub sometimes truncates or reformats the description shown in meta tags.
 * A strict string equality is brittle. Token overlap keeps the test meaningful
 * without flaking on harmless cosmetic changes.
 */

test('GitHub: API repo data matches UI for microsoft/playwright @Hybrid @Single', async ({ request, page }) => {
  // Skip in CI to avoid GitHub API rate-limit flakes
  test.skip(!!process.env.CI, 'Skipped in CI: GitHub unauthenticated API is often rate-limited');

  // ---------- 1) Fetch canonical data from the API ----------
  const apiRes = await request.get('https://api.github.com/repos/microsoft/playwright');
  // Hard assertion: we truly expect GitHub to be up for this repo.
  await expect(apiRes, 'GitHub API should respond 200 for microsoft/playwright').toBeOK();

  // Narrow the shape we care about (helps IntelliSense + maintenance).
  const repo = await apiRes.json() as {
    full_name: string;          // e.g. "microsoft/playwright"
    owner: { login: string };   // "microsoft"
    name: string;               // "playwright"
    description: string | null; // repo description or null
  };

  // Quick sanity checks so we fail *here* if the API shape changes.
  expect(repo.full_name.toLowerCase()).toBe('microsoft/playwright');
  expect(repo.owner.login.toLowerCase()).toBe('microsoft');
  expect(repo.name.toLowerCase()).toBe('playwright');

  // ---------- 2) Open the public repo page ----------
  await page.goto('https://github.com/microsoft/playwright');

  // ---------- 3) Header assertion (robust for multi-heading pages) ----------
  // GitHub has multiple headings; we ask for the <h1> that contains both pieces.
  const header = page
    .getByRole('heading', { level: 1 })
    .filter({ hasText: /microsoft\s*\/\s*playwright/i });

  await expect(header).toBeVisible();

  // ---------- 4) Read the UI's "meta description" ----------
  // Helper to fetch <meta name="description" content="..."> text, trimmed.
  async function getMetaDescription(p: typeof page): Promise<string> {
    const selector = 'meta[name="description"]';
    const content = await p.locator(selector).getAttribute('content');
    return (content ?? '').trim();
  }

  // Normalize text for fair comparisons: lower case, squeeze whitespace.
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

  // Grab both sides, normalized.
  const apiDesc = norm((repo.description ?? '').trim());
  const uiDesc  = norm(await getMetaDescription(page));

  // ---------- 5) Tolerant comparison of API vs UI ----------
  // Strategy:
  //  - exact string match, OR
  //  - UI contains API, OR
  //  - token overlap threshold (1/3 of tokens by default, capped to 8 tokens)
  const tokens = Array.from(new Set(apiDesc.match(/[a-z0-9\-]{3,}/g) ?? [])).slice(0, 8);
  const hits   = tokens.filter(t => uiDesc.includes(t)).length;
  const needed = Math.min(2, Math.max(1, Math.floor(tokens.length / 3))); // at least 1, at most 2

  // Optional (handy when debugging): log the two strings and token math
   console.table({ apiDesc, uiDesc, tokens: tokens.join(', '), hits, needed });

  expect(
    uiDesc === apiDesc       // exact
    || uiDesc.includes(apiDesc) // UI contains API string
    || hits >= needed        // token overlap threshold
  ).toBeTruthy();

  // ---------- Optional demo: visible text check (kept commented) ----------
  // On some pages GitHub shows a visible "About" description. If you want to
  // demo a visible-text assertion too, you can try:
  //
  // const aboutRegion = page.getByRole('region', { name: /about/i }).first();
  // if (await aboutRegion.isVisible()) {
  //   const snippet = (repo.description ?? '').slice(0, 60).trim(); // short slice avoids small edits
  //   if (snippet) await expect(page.getByText(snippet, { exact: false })).toBeVisible();
  // }

});