# 🧪 TekQA Playwright Portfolio  
![Playwright Tests](https://github.com/rmgoede/tekqa-playwright-portfolio/actions/workflows/playwright.yml/badge.svg)


> Automated end-to-end testing portfolio showcasing CI/CD integration, cross-browser execution, and GitHub Actions workflow optimization.

---

## 🚀 Project Overview
This repository demonstrates a professional Playwright test automation setup with:

- ✅ Continuous Integration via **GitHub Actions**
- ⚡ Browser caching for faster CI runs
- 🧭 HTML reports + trace artifacts for debugging
- 🧩 Modular test structure using **TypeScript**
- 🔐 Environment-based configuration with `.env` and `.env.example`

---
## 📂 Repository Structure
```
📁 .github/workflows/     →  GitHub Actions CI configuration  
🧪 tests/                 →  Test suites (UI, API, POM)  
🧰 scripts/               →  Utility scripts (local-only helpers)  
⚙️  playwright.config.ts   →  Global Playwright settings  
📦 package.json           →  Dependencies & npm scripts  
📘 README.md              →  Documentation & setup guide  
```

## ⚙️ Setup & Installation

### 1️⃣ Install dependencies & browsers
```bash
npm ci
npx playwright install
```
---

## 👨‍💻 Author
**Ryan Goede** — TekQA Consulting  
🌐 https://tekqaconsulting.com



## 🏁 Status
- ✅ 14/14 tests passing on GitHub Actions (Chromium)
- 🧪 Framework: Playwright + TypeScript
- 📦 CI: GitHub Actions with cached browsers & artifacts


## 🧰 Useful Commands
```
npm run test:headed        # Run all tests headed
npm run test:chromium      # Chromium only
npm run test:ui            # Playwright UI mode
npm run report             # Open last HTML report
npm run update-snapshots   # Approve new visual baselines
