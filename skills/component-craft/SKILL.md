---
name: component-craft
description: "Build accessible Next.js components with shadcn/ui (Base UI) and semantic HTML, tokens-only, RSC-first. Use in the build phase, first (components before sections/pages)."
---

# component-craft

Turn tokens + content into components — **the atomic base of the build** (components → sections →
page). Canon: Brad Frost *Atomic Design*; WHATWG HTML; shadcn/ui (Base UI primitives).

## Rules

- **shadcn/ui for every interactive widget** — dialog, menu, tabs, disclosure, tooltip, combobox.
  Current shadcn is built on **Base UI** (`@base-ui/react`), the successor to Radix. Never hand-roll
  these; they give APG-correct keyboard/roles/focus for free.
- **Button API:** the current shadcn `Button` has **no `asChild`**. For a control that *navigates*,
  style an `<a>` with `buttonVariants({ variant, size, className })`; use `<Button>` for real actions
  (or its `render` prop for polymorphism). Keep links `<a>` and actions `<button>` — semantics first.
- **Semantic HTML everywhere else.** Real `<button>`/`<a>`, one `<h1>`, landmark elements
  (`<header>/<nav>/<main>/<footer>`), labelled controls. Semantics is accessibility done at the source.
- **RSC by default.** Server Components unless the node needs interactivity; put `"use client"` at
  the *leaf*, not the page root. Less client JS → better INP/LCP.
- **Tokens only.** Style with Tailwind utilities backed by the shadcn theme — no raw hex, no magic
  px. If a value isn't in the token system, fix the tokens (don't inline).
- **Composition over configuration.** Small, single-purpose components with clear props; compose up.
- **`next/image` (sized, AVIF/WebP) and `next/font`** for all media/fonts.

## Quality bar (god-tier)
- Every interactive element is keyboard-operable with a visible focus ring, by construction.
- The DOM is meaningful with CSS off; markup validates (the semantics gate).
- Components are reusable and token-driven — the same button everywhere, no divergent one-offs.

## Feeds
`responsive-layout` (compose into sections) → page assembly → `interaction-motion` (last).
