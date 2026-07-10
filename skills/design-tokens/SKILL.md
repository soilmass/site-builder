---
name: design-tokens
description: "Systematize a committed aesthetic direction into shadcn/Tailwind tokens — structure before color, contrast-checked. Use in the tokens phase after visual-taste sets direction."
---

# design-tokens

Turn the **already-committed** aesthetic direction (from `visual-taste`) into the shadcn CSS-variable
theme + Tailwind v4 `@theme`. Primary system; a DTCG/Style Dictionary export is optional. Fires
after direction, before `component-craft`.

## Order matters: structure before color

1. **Structural tokens first** (so hierarchy holds in grayscale):
   - **Type scale** — one modular ratio, limited weights, body ≥ 16px, `--font-sans` via `next/font`.
   - **Spacing** — an 8pt-based scale; generous by default.
   - **Radius / density** — `--radius`; consistent.
2. **Color roles last** — the shadcn semantic set for light *and* dark: `--background`, `--foreground`,
   `--primary`/`--primary-foreground`, `--secondary`, `--muted`/`--muted-foreground`, `--accent`,
   `--border`, `--input`, `--ring`, `--destructive`. **Roles, never raw hex in components.**
3. **Depth** — a small shadow/elevation ramp used to signal layering, not decoration.

## Contrast is a build-time gate, met here
Every foreground/background pairing must meet **WCAG 2.2** (4.5:1 text, 3:1 large/UI) in *both*
light and dark. Record the ratios. The a11y gate checks this — passing here means passing there.

## Quality bar (god-tier)
- The design reads as intentional in grayscale before any color is applied.
- One coherent scale for type and one for spacing — no off-scale one-offs.
- Color expresses the direction and the brand, and every pairing is contrast-safe.

## Feeds
`component-craft` (components consume tokens only). Optionally export `.site/tokens.json` (DTCG).
