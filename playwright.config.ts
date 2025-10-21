import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // In CI, keep the report artifact; don't auto-open.
  reporter: [['html', { open: 'never' }]],

  use: {
    // Common workplace default is headless; use --headed when you want visuals.
    headless: true,
    //BASE URL if you have an app server
    baseURL: 'https://adventures.polaris.com',

    // Good debugging defaults
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // ...your existing settings
  testIdAttribute: 'data-test',   // 👈 make getByTestId() look for data-test=
  
    viewport: { width: 1280, height: 720 },
    // baseURL: 'http://localhost:3000', // enable if you have an app server
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
   // { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

  // If you have a web app to start, uncomment:
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
