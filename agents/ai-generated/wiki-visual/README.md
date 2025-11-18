# 📘 Wikipedia Visual Snapshots (AI Mini-Suite)

This self-contained suite demonstrates Playwright **visual regression testing** against stable Wikipedia articles — structured like the AI-generated suites, but **authored manually** for clarity and maintainability within your hybrid workflow.

---

## 🔍 What This Shows

- **Visual Regression Testing** using `expect().toHaveScreenshot()`
- **Semantic Locators**
  - `getByRole('heading', { level: 1 })` for the article title
  - `.infobox` (when present) for sidebar snapshots
- **Public, Read-Only Site**
  - Reliable, CI-safe target with **no authentication required**
- **CI-Friendly Snapshot Workflow**
  - Baselines stored under a `*_snapshots` directory

---

## 📁 Suite Structure

```text
wiki-visual/
│
├── tests/
│   ├── wiki-visual.spec.ts
│   └── wiki-visual.spec.ts-snapshots/
│       ├── Playwright-heading.png
│       ├── TypeScript-heading.png
│       ├── TypeScript-infobox.png
│       └── Software-testing-heading.png
│
├── playwright.config.ts
└── README.md   ← (this file)
```

---

## ▶️ How to Run

### **Run normally**
```bash
npx playwright test -c agents/ai-generated/wiki-visual
```

### **Update snapshots**
```bash
npx playwright test -c agents/ai-generated/wiki-visual --update-snapshots
```

---

## 🎯 Purpose

This mini-suite is intentionally lightweight.

It demonstrates how **manual, human-crafted visual tests** can still live inside the AI-inspired folder structure, reinforcing the hybrid workflow:

- **AI for planning & generation**
- **Human for refinement & reliability**

The result: stable, maintainable, real-world visual checks that feel consistent with the rest of your AI-enhanced portfolio.

---
