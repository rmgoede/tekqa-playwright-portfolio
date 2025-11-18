import { test, expect } from '@playwright/test';

// We'll test a small set of stable Wikipedia articles
const articles = [
  'Playwright',
  'TypeScript',
  'Software_testing'
];

test.describe('@ai @visual Wikipedia Visual Snapshots', () => {
  for (const article of articles) {
    test(`visual snapshot of Wikipedia article: ${article}`, async ({ page }) => {

      // 1️⃣ Navigate to the article
      await page.goto(`https://en.wikipedia.org/wiki/${article}`);

      // 2️⃣ Wait for the main heading (H1)
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();

      // 3️⃣ Snapshot the H1 heading area
      await expect(heading).toHaveScreenshot(`${article}-heading.png`, {
        maxDiffPixelRatio: 0.02
      });

      // 4️⃣ Snapshot the infobox if it exists (common on many articles)
      const infobox = page.locator('.infobox');
      if (await infobox.count()) {
        await expect(infobox).toHaveScreenshot(`${article}-infobox.png`, {
          maxDiffPixelRatio: 0.02
        });
      }
    });
  }
});
