---
name: responsive-layout
description: "Compose components into resilient, responsive sections and pages — intrinsic layout, fluid type, container queries. Use when assembling sections/pages in the build phase."
---

# responsive-layout

Assemble components into sections and pages that hold up at every size and content length. Fires
after `component-craft`, before motion. Canon: Bell & Pickering *Every Layout*; Marcotte *Responsive
Web Design*; CSS Grid/Flexbox.

## Rules

- **Intrinsic, content-driven layout.** Prefer layouts that respond to content and container
  (Flexbox, Grid, `min()/max()/clamp()`, container queries) over a pile of breakpoints.
- **Grayscale-thinking composition.** Get hierarchy, spacing rhythm, and alignment right using size
  and space alone — if it reads well without color, color will only strengthen it.
- **Fluid type and space** with `clamp()` on the token scale; comfortable measure (~45–75ch) preserved.
- **Mobile works first, not last.** No horizontal scroll; tap targets ≥ 44px; the primary action
  reachable on a small screen.
- **Reflow, don't shrink.** Support 200% zoom / 320px width without breakage (WCAG reflow).
- **The grid is real.** Consistent columns/gutters; deliberate grid-breaks only as a signature move.

## Verified across a viewport matrix
Design and check at **320 · 375 · 768 · 1280 · 1920** (smallest-supported → wide). The
`responsive-gate` enforces **no horizontal overflow at any width** and **tap targets ≥ 24px** (WCAG
2.5.8 AA; aim 44px). Common overflow causes to avoid: fixed widths, `100vw` with a scrollbar,
unwrapped long strings, and images without a reserved size (use `ImageSlot`).

## Content resilience
Layouts must survive real content: long titles/names wrap or truncate cleanly, missing data doesn't
collapse a grid, and text expansion (translation) doesn't break the layout (`states` skill).

## Quality bar (god-tier)
- Every breakpoint and every content length looks composed, never "squished" or orphaned.
- Whitespace scales gracefully; the page breathes on desktop and stays scannable on mobile.
- No horizontal scrollbar, ever; every control is comfortably tappable on a phone.

## Feeds
Page assembly with real copy, then `interaction-motion`. Layout stability is checked by the perf
gate (CLS) and the a11y gate (reflow).
