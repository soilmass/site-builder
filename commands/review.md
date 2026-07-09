---
description: "Phase 5 — run the judgment reviews (taste, manual accessibility, content) that gates can't catch."
allowed-tools: "Bash Read Write Edit Task"
---

# /site-builder:review — judgment reviews

The gates cover only the machine-verifiable ~40%. Now run the judgment reviewers as subagents, each
with an independent eye, against the running site:

- `taste-reviewer` — hierarchy, spacing rhythm, alignment, "does it look designed" (Refactoring UI + NN/g 5).
- `a11y-manual-reviewer` — keyboard-only traversal, focus order, screen-reader labels, the ~60% axe misses (WCAG + COGA).
- `content-reviewer` — clarity, scannability, reading level, voice consistency (GOV.UK + plain language).

Also apply the `ethical-design` check: no dark patterns; consent/privacy handled where data is collected.

Each reviewer writes `.site/review/<name>.md` ending in a machine-readable line:
`VERDICT: PASS` or `VERDICT: BLOCK` (with the specific issues above it).

If any `VERDICT: BLOCK`, return to `/site-builder:build`. When all PASS and gates are green, state
what's next: `/site-builder:ship`.
