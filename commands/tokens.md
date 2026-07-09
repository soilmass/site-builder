---
description: "Phase 2 — generate the design-token system and theme (color, type, space, radius, shadow, motion)."
---

# /site-builder:tokens — design tokens & theme

Read `.site/brief.md` (brand/taste direction) and `.site/ia.md`. Engage `visual-taste` and
`design-tokens`.

Produce **`.site/tokens.json`** in **W3C DTCG format**, structured in three tiers:

- **Primitive** — raw scales: a color ramp, a modular type scale, an 8pt-based spacing scale,
  radius, shadow/elevation ramp, motion (durations, easings).
- **Semantic** — role-based aliases: `surface`, `text`, `text-muted`, `action`, `action-hover`,
  `border`, `focus`, and status (`success`/`warning`/`danger`/`info`). Include light and dark.
- **Component** — only where a component needs a specific value not covered by semantics.

Rules (from the taste kernel):
- Colors are **roles, never names in components**. Every semantic text/action pairing must meet
  **WCAG 2.2 contrast** against its surface — check and record the ratios.
- Type: limited weights, body ≥ 16px, a coherent scale ratio.
- Spacing: one scale, generous defaults.

Then map tokens into the Next.js template's Tailwind v4 `@theme` (via Style Dictionary) so the
build consumes them. State what's next: `/site-builder:build`.
