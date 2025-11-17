import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Only look for tests in THIS mini-suite folder
  testDir: './tests',

  // Keep things quick and CI-friendly
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',

  // Define a single project: chromium
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
