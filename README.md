# 🧪 TekQA Playwright Portfolio  
![Playwright Tests](https://github.com/rmgoede/tekqa-playwright-portfolio/actions/workflows/playwright.yml/badge.svg)

> Automated end-to-end testing portfolio showcasing CI/CD integration, cross-browser execution, and GitHub Actions workflow optimization.

---

## 🚀 Project Overview
This repository demonstrates a professional Playwright test automation setup with:

- ✅ Continuous Integration via **GitHub Actions**
- ⚡ Fast CI execution using cached browser binaries
- 🧭 HTML reports + trace artifacts for debugging failures
- 🧩 Modular test structure using **TypeScript**
- 🔐 Environment-based configuration with `.env` and `.env.example`

---

## 🧭 What This Portfolio Demonstrates

This project reflects a **practical, real-world learning path** in modern test automation.  
Each test suite demonstrates a different testing technique, similar to what is used on real product teams.

The goal here is **clarity, maintainability, and choosing the right tool for the job** — not showing off complexity.

| Area of Focus | Example Test(s) | What It Demonstrates | Why It Matters |
|---|---|---|---|
| **Core UI flow testing** | `saucedemo-login.spec.ts` | Stable locators + meaningful assertions | Foundation of reliable UI automation |
| **Data-driven testing (DDT)** | `saucedemo-cart-ddt.spec.ts` | Externalized product data → multiple scenarios | Avoids duplicated test logic; scales coverage cleanly |
| **Visual regression testing** | `visual-inventory.spec.ts` | Snapshot versioning & pixel diffs | Detects subtle UI regressions with no CSS inspection |
| **API + UI hybrid workflow** | `github-api-ui-hybrid.spec.ts` | Create test data via API, verify in UI | Reduces test flakiness & speeds setup significantly |
| **Page Object Model (POM)** | `polaris-loginflow.spec.ts`, `polaris-profile-pom.spec.ts` | Encapsulated locators and actions | Keeps tests readable and easier to maintain over time |
| **CI reliability & trace debugging** | GitHub Actions workflow | Trace logs + screenshot artifacts | Enables fast root-cause investigation and team collaboration |

> **In short:** These tests show how to build automation that is **clear to read**, **stable across UI changes**, and **practical for ongoing team use.**

---

## 🎯 Scope & Intent

This project is *not* intended to be:

- A full enterprise automation framework  
- A complete regression suite  
- An attempt to showcase “expert-level” Playwright skills  

This *is* intended to demonstrate:

- A solid and growing foundation in Playwright
- Understanding of how real software teams structure automated tests
- Ability to apply patterns like POM, DDT, and hybrid workflows appropriately
- Comfort running tests in **CI**, not just locally

I will continue adding to this repository as I expand depth and coverage.  
This is a **snapshot of where my automation skillset is today**, not the finish line.

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
- ✅ 14/14 test cases passing in GitHub Actions across Chromium + Firefox
- 🧪 Framework: Playwright + TypeScript
- 📦 CI: GitHub Actions with cached browsers & artifacts


## 🧰 Useful Commands
```
# Fast local smoke test (quick feedback loop)
npm run test:quick        

# Full suite (all tests across Chromium + Firefox)
npm run test:all           

# Browser-specific execution
npm run test:chromium      
npm run test:ff            

# Debugging / development helpers
npm run test:ui            # Playwright UI test runner
npm run test:headed        # Run tests in visible browser
npm run debug              # PWDEBUG=1 interactive mode

# Results & visual regression
npm run report             # Open the last HTML report
npm run update-snapshots   # Approve new visual baselines
