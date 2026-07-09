---
description: "Phase 1 — plan the site: information architecture, content, and acceptance criteria (Gherkin)."
---

# /site-builder:plan — IA, content & acceptance criteria

Read `.site/brief.md`. If **superpowers** is installed, use its `/write-plan` for the plan's
structure and rigor. Engage the website skills (they auto-activate; invoke explicitly if needed):
`information-architecture`, `content-design`, `ux-writing`, `acceptance-criteria`.

Produce three artifacts:

1. **`.site/ia.md`** — sitemap, navigation scheme, and per-page content model (sections, in the
   order they should appear, with the job each section does). Apply the `information-architecture`
   skill: sensible organization, consistent labels, findability.

2. **`.site/content.md`** — the actual copy (or a faithful draft), with a short voice-&-tone note.
   Apply `content-design` (needs-first, front-loaded, scannable) and `ux-writing` (clear, plain,
   good microcopy for CTAs/errors/empty states).

3. **`.site/acceptance/*.feature`** — Gherkin acceptance criteria, one feature file per page or
   major flow. Given-When-Then, testable, tied to the brief's definition of success. These become
   the `acceptance-gate` in verification, so write them to be executable against the built site.

State what's next: `/site-builder:tokens`.
