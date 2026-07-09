# site-builder — operating doctrine

You are building **high-end, tested websites** with the site-builder methodology. This file
is standing doctrine: the taste kernel, the Next.js conventions, and the Definition of Done.
The authoritative canon is `docs/knowledge-base.md`; the architecture is `docs/architecture.md`.

## The spine (never skip a phase)

Work proceeds through seven commands, each writing an artifact under the project's `.site/`:

`brief → plan → tokens → build → verify → review → ship`

Failures in `verify` or `review` loop back to `build`. You may not declare a site done until
the Definition of Done (below) is met — this is enforced mechanically by the DoD Stop hook.

## Taste kernel (non-negotiable visual rules)

Codified from Refactoring UI, NN/g's 5 Principles of Visual Design, and Gestalt. Apply on
every visual decision (the `visual-taste` skill carries the full checklist):

1. **Spacing is a system, not a guess.** Use the token spacing scale only. Start with *too much*
   whitespace and remove; never cramped.
2. **Hierarchy by size/weight/color, not by rules and boxes.** De-emphasize secondary content
   rather than emphasizing everything.
3. **Type scale is fixed.** Pick from the modular scale in tokens; limit weights; body ≥ 16px;
   comfortable measure (~45–75ch).
4. **Color has roles, not names.** Every color is a semantic token (surface, text, action,
   border, semantic-status). Never a raw hex in a component.
5. **Contrast is a floor, not a nicety.** All text/UI meets WCAG 2.2 (4.5:1 text, 3:1 large/UI).
6. **Depth is deliberate.** Shadows/elevation come from the token ramp; used to signal layering,
   not decoration.
7. **Alignment and a real grid.** Everything sits on the layout grid; optical alignment where it
   matters.

If a choice can't be expressed in tokens, the token system is incomplete — fix the tokens, don't
hardcode.

## Next.js output conventions (how generated sites are built)

- **App Router + React Server Components by default.** Add `"use client"` only at interactive
  leaves, never at the page root. Less client JS → better INP/LCP.
- **Styling: Tailwind CSS v4 `@theme`,** fed from `.site/tokens.json` via Style Dictionary. Components
  reference tokens/utilities only — the `tokens-gate` fails on raw hex.
- **Components: Radix Primitives** (headless) styled with Tailwind. Use them for every interactive
  widget (dialog, menu, tabs, disclosure, tooltip) so keyboard/roles/focus are APG-correct.
- **Images: `next/image`** (sized, AVIF/WebP). **Fonts: `next/font`** (self-hosted, `display: swap`).
- **Motion: CSS transitions first;** Framer Motion where needed, always guarded by
  `useReducedMotion()` / `prefers-reduced-motion`.
- **SEO: Next Metadata API** for title/description/OG + a JSON-LD block per page type.
- **Semantic HTML always:** one `<h1>`, landmark elements, real `<button>`/`<a>`, labelled controls.

## Definition of Done (enforced by the Stop hook)

A site may be shipped only when **all** are true:

- [ ] Every acceptance criterion (`.site/acceptance/*.feature`) passes.
- [ ] Gate report `.site/reports/summary.md` is `STATUS: PASS` — a11y, performance, semantics,
      security, SEO, tokens, visual-regression, sustainability all green (per the archetype's gate set).
- [ ] Every judgment review (`.site/review/*.md`) is `VERDICT: PASS` — taste, manual a11y, content.
- [ ] No dark patterns; consent/privacy handled where user data is collected (`ethical-design`).

Report results with evidence (the gate outputs). **Never claim "done" while any of the above is red** —
the DoD Stop hook will block you, and claiming otherwise is a correctness failure.
