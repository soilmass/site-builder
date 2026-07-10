---
name: information-architecture
description: "Structure a site's content, navigation, and labels before any visual design. Use in the plan phase for sitemap, page/section order, nav systems, and content models."
---

# information-architecture

**Fires first in the content chain — before content, copy, tokens, or layout.** Structure is the
skeleton everything else hangs on; get it wrong and no amount of visual polish saves the site.
Canon: Rosenfeld/Morville/Arango, *Information Architecture: For the Web and Beyond*.

## Do, in order

1. **Inventory the jobs.** From `.site/brief.md`, list what each audience needs to do/find, ranked
   by the site's single primary goal. Structure serves the goal, not the org chart.
2. **Organization scheme.** Choose how content is grouped (by task, audience, topic). Keep it shallow
   — findability beats completeness. One obvious path to each primary job.
3. **Sitemap + page order.** Define pages and, per page, the **section order** — the sequence a
   visitor should encounter ideas (this order drives the design; decide it now, not at build).
4. **Navigation systems.** Global nav (primary jobs only), utility, footer, in-page. Labels must be
   consistent, plain, and match the user's words — never clever or internal jargon.
5. **Content model.** For repeated content (cards, posts, features), define the type: its fields and
   relationships, so content and components stay consistent.

## Quality bar (god-tier)
- A first-time visitor reaches the primary action in one obvious step.
- Labels pass the "say it out loud" test — no ambiguity, no jargon.
- Section order tells a coherent story top-to-bottom before a single pixel is styled.

## Hands off to
`content-design` (real copy for this structure) → then `visual-taste`/`design-tokens`. Write the
result to `.site/ia.md`. Do not proceed to visual work until the structure is settled.
