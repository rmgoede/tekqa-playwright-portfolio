import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 🔹 Load the data file dynamically (data-driven testing)
const dataPath = path.resolve(__dirname, '../data/queries.json');
const { queries } = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as { queries: string[] };

// 🔹 Group related tests under one label for easier reporting
test.describe('@ai @ddt HN search DDT', () => {
  // 🔹 Loop through each query value from the JSON
  for (const q of queries) {
    test(`search results include query: "${q}"`, async ({ page }) => {
      // 1️⃣ Navigate to Hacker News Search (Algolia)
      await page.goto('https://hn.algolia.com/');

      // 2️⃣ Locate the search input by its placeholder text
      const searchBox = page.getByPlaceholder(/search/i);
      await expect(searchBox).toBeVisible();

      // 3️⃣ Type the query term and press Enter
      await searchBox.fill(q);
      await searchBox.press('Enter');

      // 4️⃣ Verify that the query shows up in the URL (?query= or ?q=)
      await page.waitForURL(/hn\.algolia\.com\/\?/); // wait for search results URL
      const params = new URL(page.url()).searchParams;
      const qParam = params.get('query') ?? params.get('q');
      expect(qParam?.toLowerCase()).toContain(q.toLowerCase());


      // 5️⃣ Check that at least one result contains the query text
      await expect(page.getByText(new RegExp(q, 'i')).first()).toBeVisible();

      // 6️⃣ Sanity check: ensure there’s at least one link in the result list
      const anyResultLink = page.locator('a').filter({ hasText: /.+/ }).first();
      await expect(anyResultLink).toBeVisible();

      // 7️⃣ Wait until network is idle so we know content is fully loaded
      await page.waitForLoadState('networkidle');
    });
  }
});
