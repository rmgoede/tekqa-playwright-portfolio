import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Nice defaults
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],

  // Defaults shared by all projects
  use: {
    headless: true,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },

  // Three independent “projects”:
  projects: [
    // CORE suite on Chromium
    {
      name: 'chromium',
      testDir: 'tests',
      use: {
        ...devices['Desktop Chrome'],
        // Polaris needs baseURL for `page.goto('/')`
        baseURL: process.env.CORE_BASE_URL ?? 'https://adventures.polaris.com',
      },
    },

    // CORE suite on Firefox
    {
      name: 'firefox',
      testDir: 'tests',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.CORE_BASE_URL ?? 'https://adventures.polaris.com',
      },
    },

    // AI-generated suite (SauceDemo) — runs on Chromium by default
    {
      name: 'ai-generated',
      testDir: 'agents/ai-generated/tests',
      use: {
        ...devices['Desktop Chrome'],
        // No baseURL needed — those specs use absolute URLs
      },
    },
  ],
});
