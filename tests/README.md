# TekQA Playwright Portfolio  
![Playwright Tests](https://github.com/rmgoede/tekqa-playwright-portfolio/actions/workflows/playwright.yml/badge.svg)

This repository demonstrates automated Playwright tests running in CI/CD via GitHub Actions.

# 1) Install deps & browsers
npm ci
npx playwright install

# 2) Add your secrets
cp .env.example .env
# edit .env with your Polaris creds (and optional GitHub token)

# 3) Run tests
npm test                 # all projects from config (default Chromium)
npm run test:headed      # headed run
npm run test:chromium    # chromium only
npm run test:ui          # visual test runner

# 4) Open last HTML report
npm run report


