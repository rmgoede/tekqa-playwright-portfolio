import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Slower pages like Wikipedia can benefit from a little more time
  timeout: 45_000,

  // Enable retries in CI; local is fast/no retries
  retries: process.env.CI ? 2 : 0,

  reporter: 'list',

  // Only run Chromium for simplicity and speed
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
