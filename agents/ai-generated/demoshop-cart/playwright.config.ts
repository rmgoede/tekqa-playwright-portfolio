import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Only look for tests in THIS mini-suite folder
  testDir: './tests',

  // Keep runs quick and CI-friendly
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',

  // Single project: Chromium desktop
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});