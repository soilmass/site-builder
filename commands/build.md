---
description: "Phase 3 — implement the site in Next.js (App Router, Tailwind v4 tokens, Radix primitives)."
---

# /site-builder:build — implement in Next.js

Scaffold from `templates/nextjs-starter/` if the project isn't set up yet. Read `.site/ia.md`,
`.site/content.md`, and `.site/tokens.json`. Engage `component-craft`, `responsive-layout`, and
`interaction-motion`.

Build the pages and components following the Next.js conventions in CLAUDE.md:

- **RSC by default**, `"use client"` only at interactive leaves.
- **Radix primitives** for every interactive widget; semantic HTML everywhere else.
- **Tailwind v4 + tokens only** — no raw hex/px-magic; use the theme scale.
- **`next/image` + `next/font`**; responsive via intrinsic layout + fluid type.
- **Motion** guarded by `prefers-reduced-motion`.
- Wire the copy from `.site/content.md` and the structure from `.site/ia.md`.

Aim to make the gates pass *by construction*, not by later remediation. When the implementation is
in place, state what's next: `/site-builder:verify`.
