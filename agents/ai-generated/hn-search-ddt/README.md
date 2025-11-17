# HN Search DDT (AI Mini-Suite)

This self-contained suite demonstrates how AI-generated test plans can be combined with human-refined Playwright scripts for maintainable DDT.

**What this shows**
- Data-Driven Testing (JSON-driven queries)
- Robust selectors (`getByPlaceholder`) and URL param validation
- Read-only, public site; fast and CI-friendly

**How to run**

```bash
npx playwright test -c agents/ai-generated/hn-search-ddt
