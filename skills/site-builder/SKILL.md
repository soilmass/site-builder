---
name: site-builder
description: "Doctrine and workflow for building high-end, tested Next.js websites. Use whenever building, designing, styling, or reviewing a website, or when running any /site-builder command."
---

# site-builder — doctrine

You build **high-end, tested websites** with the site-builder methodology. This skill carries the
standing rules (a plugin-root CLAUDE.md does not load, so the doctrine lives here). Canon:
`docs/knowledge-base.md`; architecture: `docs/architecture.md`.

## Invent as little as possible — compose, don't reinvent

- **Methodology:** compose with **superpowers** if installed. Use its `/brainstorm` for the brief,
  `/write-plan` + `/execute-plan` for planning/execution, its verification-before-completion habit,
  and its `code-reviewer` agent. site-builder adds only the *website* layer on top.
- **Scaffold:** `create-next-app` (never a hand-authored template). Then **shadcn/ui**
  (`npx shadcn@latest init` / `add`) for accessible Radix-based components you own.
- **Theming:** shadcn's CSS-variable theme + Tailwind v4 `@theme` is primary. DTCG/Style Dictionary
  is an optional export, not the default.
- **Gates:** drive de facto CLIs — Lighthouse CI, `@axe-core/playwright`, html-validate, CO2.js —
  via thin wrappers. Don't reimplement what a standard tool already does.

## The spine (never skip a phase)

`/site-builder:brief → plan → tokens → build → verify → review → ship`

Each writes an artifact under the project's `.site/`. `verify`/`review` failures loop back to
`build`. You may not declare a site done until the Definition of Done is met — the DoD Stop hook
enforces this mechanically.

## Taste kernel (non-negotiable; the `visual-taste` skill has the full checklist)

1. Spacing is a system — token scale only; start with too much whitespace.
2. Hierarchy via size/weight/color, not boxes; de-emphasize rather than emphasize.
3. Fixed type scale; limited weights; body ≥ 16px; measure ~45–75ch.
4. Color has roles, never raw hex in components (use shadcn semantic tokens).
5. Contrast is a floor — WCAG 2.2 (4.5:1 text, 3:1 large/UI).
6. Depth is deliberate — elevation from the token ramp.
7. Everything on a real grid.

## Next.js conventions (make gates pass by construction)

- App Router + RSC by default; `"use client"` only at interactive leaves.
- shadcn/ui (Radix) for every interactive widget; semantic HTML everywhere else.
- Tailwind v4 + shadcn tokens only — no raw hex/magic values.
- `next/image` (sized, AVIF/WebP) + `next/font` (self-hosted, `display: swap`).
- Motion guarded by `prefers-reduced-motion`; Metadata API + JSON-LD for SEO.

## Definition of Done (enforced by the Stop hook)

Ship only when **all** hold, reported with evidence:

- [ ] Every acceptance criterion (`.site/acceptance/*.feature`) passes.
- [ ] `.site/reports/summary.md` is `STATUS: PASS` (a11y, performance, semantics, plus the
      archetype's remaining gates).
- [ ] Every `.site/review/*.md` is `VERDICT: PASS` (taste, manual a11y, content).
- [ ] No dark patterns; consent/privacy handled where data is collected.

**Never claim a site is "done" while any of the above is red** — the DoD Stop hook will block you,
and claiming otherwise is a correctness failure.
