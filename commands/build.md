---
description: "Phase 3 — scaffold with create-next-app + shadcn/ui and implement the site per the plan."
allowed-tools: "Bash Read Write Edit Task"
---

# /site-builder:build — scaffold & implement

**Invent as little as possible.** If the project isn't scaffolded yet, follow
`templates/scaffold-recipe.md` exactly: `create-next-app` → `shadcn init` → add the components the
plan needs (`shadcn add …`) → install the gate toolchain → copy `templates/overlay/*`. Do NOT
hand-author an app or a token pipeline.

Then read `.site/ia.md`, `.site/content.md`, and the shadcn theme from `/site-builder:tokens`, and
implement in **atomic order — never retrofit**: (1) **components** (`shadcn add`, styled with tokens,
via `component-craft`) — every image an `ImageSlot` recorded in `.site/media.json` (`media` skill),
plus the non-happy states and `not-found.tsx`/`error.tsx` (`states` skill); (2) **sections** (compose;
hierarchy/spacing in grayscale-thinking via `responsive-layout`, verified across the viewport matrix);
(3) **page** (assemble with the real copy); (4) **motion last** as enhancement (`interaction-motion`,
`prefers-reduced-motion`-guarded). Style **both light and dark** themes throughout. If **superpowers**
is installed, drive the implementation with its `/execute-plan`.

Follow the Next.js conventions in the `site-builder` doctrine skill:

- **RSC by default**, `"use client"` only at interactive leaves.
- **shadcn/ui (Base UI)** for every interactive widget; semantic HTML everywhere else (links styled
  with `buttonVariants(...)`, not `Button asChild`).
- **Tailwind v4 + shadcn tokens only** — no raw hex/magic values.
- **`next/image` + `next/font`**; responsive via intrinsic layout + fluid type.
- **Motion** guarded by `prefers-reduced-motion`.

Make the gates pass *by construction*. When the implementation is in place, state what's next:
`/site-builder:verify`.
