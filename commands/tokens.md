---
description: "Phase 2 — set the design theme via shadcn tokens (Tailwind v4 @theme). DTCG export optional."
---

# /site-builder:tokens — theme via shadcn tokens

Read `.site/brief.md` (brand/taste direction) and `.site/ia.md`. Engage `visual-taste` and
`design-tokens`.

**Primary (de facto):** set the theme by editing **shadcn's CSS variables** in `app/globals.css`
and the Tailwind v4 `@theme` — the standard theming for this stack. Cover:

- **Color** — the shadcn semantic roles (`--background`, `--foreground`, `--primary`,
  `--muted`, `--border`, `--ring`, plus `--destructive`) for light and dark. Every text/action
  pairing must meet **WCAG 2.2 contrast** against its surface — record the ratios.
- **Typography** — set `--font-sans` (via `next/font`), a coherent scale, limited weights, body ≥ 16px.
- **Radius / spacing / shadow** — set `--radius` and lean on Tailwind's scale; keep spacing generous.

Apply the taste kernel: roles-not-hex, fixed scales, deliberate depth. Optionally also export a DTCG
`.site/tokens.json` for portability (not required for the build).

State what's next: `/site-builder:build`.
