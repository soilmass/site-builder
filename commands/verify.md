---
description: "Phase 4 — run all quality gates against the built site and write the report."
allowed-tools: "Bash Read Write Edit Task"
---

# /site-builder:verify — run the gates

Build the site (`next build`) and run the gate subagents for this archetype. Dispatch each as a
subagent (they run their tool and return `{pass|fail, findings[]}`):

- `a11y-gate` — Playwright + axe (WCAG 2.2 AA)
- `performance-gate` — Lighthouse CI (Core Web Vitals budgets)
- `semantics-gate` — html-validate on rendered HTML
- `visual-regression-gate` — Playwright screenshots
- `seo-gate` — metadata + JSON-LD + Lighthouse SEO *(if in archetype's set)*
- `security-gate` — headers + `npm audit` *(if in set)*
- `tokens-gate` — Style Dictionary build + no-hardcoded-color *(if in set)*
- `acceptance-gate` — Playwright + Cucumber over `.site/acceptance/*.feature` *(if in set)*
- `sustainability-gate` — CO2.js page-weight budget *(if in set)*

Write each gate's raw output to `.site/reports/<gate>.json` and a rollup to
**`.site/reports/summary.md`**. The summary MUST contain a machine-readable status line:

- `STATUS: PASS` only if every run gate passed; otherwise `STATUS: FAIL`.
- One line per gate: `<gate>: PASS` or `<gate>: FAIL — <short reason>`.

If `STATUS: FAIL`, do NOT proceed — return to `/site-builder:build`, fix, and re-verify. If PASS,
state what's next: `/site-builder:review`.
