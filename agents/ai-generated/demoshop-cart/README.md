# 🛒 DemoShop Cart & Totals (AI Mini-Suite)

This mini-suite demonstrates data-driven cart validation against the Sauce Demo “Demo Shop” site — structured like the AI-generated suites, but authored manually for clarity and maintainability.

It focuses on **adding items to the cart**, **navigating checkout**, and **asserting price totals** using JSON-driven scenarios.

---

## 🔍 What This Shows

- **Data-Driven Testing (DDT)** via JSON  
  Scenarios are defined in `data/cart-cases.json` and iterated with `for (const cartCase of cartCases)`.

- **Stable, Semantic Locators**
  - Inventory cards via `getByRole('button', { name: /add to cart/i })`
  - Cart link via `[data-test="shopping-cart-link"], .shopping_cart_link`
  - Checkout fields using `getByPlaceholder()` and `getByRole()`.

- **Cart & Total Assertions**
  - Verifies cart item count matches the JSON scenario
  - Computes expected subtotal from a simple `priceMap`
  - Asserts the UI subtotal matches the calculated value

- **AI-Inspired Folder Structure**
  - Lives under `agents/ai-generated/` alongside the fully AI-generated suites
  - Tagged with `@ai @ddt` to align with the rest of your AI/Hybrid story

---

## 📂 Suite Structure

```text
demoshop-cart/
├── data/
│   └── cart-cases.json        # JSON scenarios for cart/total validation
├── tests/
│   └── demoshop-cart.spec.ts # DDT Playwright test using the JSON data
└── playwright.config.ts      # Local config for this mini-suite
```

---

## ▶️ How to Run

**Run the suite directly:**
```bash
npx playwright test -c agents/ai-generated/demoshop-cart
```

**Filter by tag (optional, if you mix suites):**
```bash
npx playwright test -c agents/ai-generated/demoshop-cart --grep @ddt
```

---

## 🎯 Purpose

This mini-suite is intentionally focused and lightweight.

It shows how human-crafted, JSON-driven tests can sit neatly inside your AI-inspired folder structure, reinforcing your hybrid workflow:

- AI for planning & generation
- Humans for correctness, data modeling, and reliability

The result: realistic cart/checkout coverage that still looks and feels consistent with the rest of your AI-enhanced portfolio.

---

## 🤝 Related AI Mini-Suites

- 🔎 HN Search DDT (AI-Hybrid)
- 📘 Wikipedia Visual Snapshots (AI-Hybrid)

All together, these build a cohesive, multi-style automation portfolio using Playwright + TypeScript.
