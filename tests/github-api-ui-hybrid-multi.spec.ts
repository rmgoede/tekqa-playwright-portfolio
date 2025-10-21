// tests/github-api-ui-hybrid-multi.spec.ts
// -----------------------------------------------------------------------------
// Purpose
//   Run the same API ↔ UI verification across multiple GitHub repos.
//   For each repo:
//     1) GET /repos/:owner/:name (GitHub REST API)
//     2) Visit repo UI on github.com
//     3) Assert H1 shows "owner/name" (robust a11y locator + regex filter)
//     4) Compare API description to UI meta description (tolerant comparison)
//     5) (Soft) Cross-check star count with generous tolerance
//
// How to run
//   npx playwright test tests/github-api-ui-hybrid-multi.spec.ts --project=chromium
//
// Optional (avoid rate limiting):
//   export GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
// -----------------------------------------------------------------------------

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

type Repo = { owner: string; name: string };

const reposPath = path.join(process.cwd(), 'data', 'github-repos.json');
const repos: Repo[] = JSON.parse(fs.readFileSync(reposPath, 'utf-8'));

// ---- helpers ----------------------------------------------------------------

/** Normalize text for resilient comparisons. */
function normalize(s: string | null | undefined): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Grab distinct, meaningful tokens from a description (letters 4+ chars). */
function descriptionTokens(input: string): string[] {
  const tokens = input.match(/[a-z]{4,}/gi) ?? [];
  return Array.from(new Set(tokens.map(t => t.toLowerCase())));
}

/** Build API headers; include token to avoid rate limits when available. */
function githubHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'User-Agent': 'tekqa-playwright' };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

/** Parse star counts like "123", "12,345", or "104k"/"1.2M" to a number. */
function parseCount(s: string | null | undefined): number | null {
  if (!s) return null;
  const t = s.trim().toLowerCase().replace(/,/g, '');
  const m = t.match(/^([\d.]+)\s*([km])?$/);
  if (!m) return Number.isFinite(Number(t)) ? Number(t) : null;
  const num = parseFloat(m[1]);
  if (!isFinite(num)) return null;
  const suffix = m[2];
  if (suffix === 'k') return Math.round(num * 1_000);
  if (suffix === 'm') return Math.round(num * 1_000_000);
  return Math.round(num);
}

// ---- tests ------------------------------------------------------------------

test.describe('GitHub: API–UI multi-repo checks @Hybrid @Multi', () => {
  for (const { owner, name } of repos) {
    const label = `${owner}/${name}`;

    test(`${label}: API and UI agree`, async ({ page, request }) => {
      // 1) API: fetch canonical repo data
      const apiUrl = `https://api.github.com/repos/${owner}/${name}`;
      const res = await request.get(apiUrl, { headers: githubHeaders() });
      await expect(res, `GET ${apiUrl} should be 200`).toBeOK();

      const data = await res.json() as {
        full_name: string;
        owner: { login: string };
        name: string;
        description: string | null;
        stargazers_count?: number;
      };

      const apiFull = normalize(data.full_name);
      const apiDesc = normalize(data.description);
      const apiStars = data.stargazers_count ?? null;
      await expect.soft(apiFull).toBe(normalize(label));

      // 2) UI: open repo page
      await page.goto(`https://github.com/${owner}/${name}`);

      // 3) H1: visible owner/name
      const header = page
        .getByRole('heading', { level: 1 })
        .filter({ hasText: new RegExp(`${owner}\\s*/\\s*${name}`, 'i') });
      await expect(header, 'H1 should include owner/name').toBeVisible();

      // 4) Description: API vs UI meta description (tolerant)
      await test.step('Description from API appears in UI meta description', async () => {
        if (!apiDesc) return; // nothing to compare

        const metaContent =
          (await page.locator('meta[property="og:description"]').first().getAttribute('content')) ??
          (await page.locator('meta[name="description"]').first().getAttribute('content')) ??
          '';

        expect(metaContent, 'UI should expose a meta description').toBeTruthy();

        const uiDesc = normalize(metaContent);
        const tokens = descriptionTokens(apiDesc).slice(0, 8);
        const hits = tokens.filter(t => uiDesc.includes(t)).length;
        const needed = Math.max(2, Math.ceil(tokens.length / 3)); // at least 2 tokens for confidence

        expect(
          uiDesc === apiDesc || uiDesc.includes(apiDesc) || hits >= needed
        ).toBeTruthy();
      });

      // 5) Stars (soft check): UI near API value with generous tolerance
      await test.step('Stars: UI ≈ API (soft, tolerant)', async () => {
        if (apiStars == null) return;

        // The stargazers link usually holds the visible count.
        // Example selector: a[href="/owner/name/stargazers"]
        const starLink = page.locator(`a[href="/${owner}/${name}/stargazers"]`).first();

        // If GitHub layout hides the count (rare), skip silently.
        const visible = await starLink.isVisible().catch(() => false);
        if (!visible) return;

        const uiText = await starLink.textContent();
        const uiStars = parseCount(uiText);

        // If parsing fails, skip the star check (layout may not show a number).
        if (uiStars == null) return;

        // Tolerance: allow ±30% difference or at least ±1,000 (whichever larger)
        const tol = Math.max(1000, Math.round(apiStars * 0.3));
        const delta = Math.abs(uiStars - apiStars);

        // Soft assertion: don’t fail the whole test on star drift
        expect.soft(
          delta <= tol,
          `Stars drift too large. API=${apiStars}, UI~=${uiStars}, tol=±${tol}`
        ).toBeTruthy();
      });
    });
  }
});
