---
name: states
description: "Design the non-happy-path states every real site needs — loading, empty, error, 404/500, offline, long-content. Use during build; AI sites routinely ship only the happy path."
---

# states

A demo shows the happy path; a shippable site handles every state. AI-built sites routinely miss
these — bake them in.

## Cover, for any dynamic surface

- **Loading** — skeletons that match final layout (not spinners), so there's no shift when content lands.
- **Empty** — a first-run/no-results state that onboards: explain the value + the first action (never "No data").
- **Error** — say what happened, why, and the way out; a retry where sensible (`ux-writing`).
- **Zero / one / many** — layouts survive 0, 1, and a large N; grids don't collapse or overflow.
- **Long content** — long titles, names, and copy wrap/truncate gracefully; no overflow (`responsive-layout`).
- **Offline / slow** — graceful degradation; the page is useful without JS (progressive enhancement).

## Required site-level pages (Next.js conventions)

- **Custom 404** — `app/not-found.tsx`: on-brand, with a way home and primary nav. Never the default.
- **Error boundary** — `app/error.tsx` (+ `global-error.tsx`): friendly recovery, not a stack trace.
- **Loading UI** — `app/loading.tsx` / route `loading.tsx` where data is fetched.

## Quality bar (god-tier)
Every state is designed with the same taste as the hero. A user who hits an error, an empty list, or
a bad URL still feels the site is cared for — and has an obvious next step.

## Enforced by
`review` (states pass) + acceptance criteria for error/empty flows. 404/500 presence is a DoD item.
