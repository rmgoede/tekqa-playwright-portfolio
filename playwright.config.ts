import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Default testDir for “core” tests; ai-generated will override with its own.
  testDir: 'tests',

  // ONE projects array that includes both browser projects (for core)
  // and a dedicated project for ai-generated.
  projects: [
    // Core suite runs in Chromium
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Core suite runs in Firefox
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // AI-generated suite (separate testDir)
    {
      name: 'ai-generated',
      testDir: 'agents/ai-generated/tests',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Shared defaults
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],

  // Global "use" defaults (no duplicates)
  use: {
    headless: true,
    testIdAttribute: 'data-test',
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // No global baseURL so the two suites stay independent.
  },

  // If you need to start a local web app later, uncomment:
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});