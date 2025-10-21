import { chromium, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

// Optional: load .env if you want to override creds there
// import 'dotenv/config';

const SAUCE_USER = process.env.SAUCE_USER ?? 'standard_user';
const SAUCE_PASS = process.env.SAUCE_PASS ?? 'secret_sauce';

type Found = { page: string; testId: string; tag: string; text: string };

async function collectTestIds(page: Page, pageLabel: string): Promise<Found[]> {
  const raw = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-test]')).map(el => ({
      testId: (el as HTMLElement).getAttribute('data-test') || '',
      tag: el.tagName.toLowerCase(),
      text: ((el as HTMLElement).innerText || '').trim().slice(0, 120),
    }))
  );
  const seen = new Set<string>();
  const unique: Found[] = [];
  for (const item of raw) {
    if (item.testId && !seen.has(item.testId)) {
      seen.add(item.testId);
      unique.push({ ...item, page: pageLabel });
    }
  }
  return unique;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const results: Found[] = [];
  const outDir = path.join(process.cwd(), 'artifacts');
  const shotsDir = path.join(outDir, 'screenshots');
  ensureDir(outDir);
  ensureDir(shotsDir);

  // 1) Login page (pre-login)
  await page.goto('https://www.saucedemo.com/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  results.push(...(await collectTestIds(page, 'Login Page')));
  await page.screenshot({ path: path.join(shotsDir, 'login.png'), fullPage: true });

  // 2) Perform login
  await page.fill('[data-test="username"]', SAUCE_USER);
  await page.fill('[data-test="password"]', SAUCE_PASS);
  await page.click('[data-test="login-button"]');

  // 3) Inventory page
  await page.waitForURL(/\/inventory\.html$/);
  await page.waitForSelector('[data-test="inventory-list"], .inventory_list', { timeout: 7000 });
  results.push(...(await collectTestIds(page, 'Inventory Page')));
  await page.screenshot({ path: path.join(shotsDir, 'inventory.png'), fullPage: true });

  // 4) Cart page
  const cartLink = page.locator('[data-test="shopping-cart-link"], #shopping_cart_container a');
  if (await cartLink.first().isVisible().catch(() => false)) {
    await cartLink.first().click();
  } else {
    await page.goto('https://www.saucedemo.com/cart.html', { waitUntil: 'domcontentloaded' });
  }
  await page.waitForURL(/\/cart\.html$/);
  results.push(...(await collectTestIds(page, 'Cart Page')));
  await page.screenshot({ path: path.join(shotsDir, 'cart.png'), fullPage: true });

  await browser.close();

  // Write CSV
  const csvPath = path.join(outDir, 'test-locators.csv');
  const header = 'Page,Data-Test,Tag,Text\n';
  const body = results
    .map(r =>
      [
        `"${r.page}"`,
        `"${r.testId}"`,
        `"${r.tag}"`,
        `"${r.text.replace(/"/g, '""')}"`,
      ].join(',')
    )
    .join('\n');
  fs.writeFileSync(csvPath, header + body, 'utf-8');

  console.log(`✅ Exported ${results.length} locators to: ${csvPath}`);
  console.log(`🖼  Screenshots saved to: ${shotsDir}`);
})().catch(err => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
