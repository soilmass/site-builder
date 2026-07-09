---
description: "Phase 0 — capture the site brief: goals, audience, brand, content, constraints. Start a new site build here."
argument-hint: "[what the site is for]"
---

# /site-builder:brief — capture the brief

You are starting a new high-end website build. Establish `.site/` as the working directory for
this project if it does not exist.

Input from the user: **$ARGUMENTS**

If **superpowers** is installed, run its `/brainstorm` to elicit and refine requirements Socratically,
then capture the result here. Otherwise interview the user directly (concise, high-signal — ask only
what you can't infer). This phase is **consume, not generate**: you are capturing inputs, not
designing yet. Cover:

- **Purpose & primary goal** — what the one job of this site is; the single most important action.
- **Audience** — who it's for; their context/device; what they need.
- **Archetype** — marketing/landing · portfolio · docs · e-commerce · other.
- **Brand & taste direction** — existing brand assets? aesthetic genre (minimal, editorial,
  bold/neo-brutalist, etc.)? references they love/hate?
- **Content** — is copy provided or to be written? key sections/messages.
- **Constraints** — deadline, must-use tech/integrations, hosting, i18n, legal/compliance.
- **Definition of success** — how we'll know it's good (feeds acceptance criteria).

Write the result to `.site/brief.md` as clear structured markdown. End by stating what's next:
`/site-builder:plan`.
