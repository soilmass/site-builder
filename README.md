# site-builder

A **Claude Code plugin** that builds high-end, tested **Next.js** websites — with taste and
validation built in. It is to websites what [superpowers](https://github.com/obra/superpowers) is
to software development: a methodology encoded as composable skills, with quality enforced by gates
rather than good intentions.

## How it works

A seven-command **spine** takes a site from brief to shipped:

```
/site-builder:brief → plan → tokens → build → verify → review → ship
```

- **Skills** (`skills/`) carry the `[JUDGMENT]` craft — taste, information architecture, content,
  UX writing, motion, component craft — and auto-activate during work.
- **Gate subagents** (`agents/`) run the `[GATE]` checks — accessibility, performance, semantics,
  security, SEO, tokens, visual regression, sustainability — each returning pass/fail.
- **Judgment reviewers** apply the checks tools can't: taste, manual accessibility, content.
- A **Definition-of-Done Stop hook** (`hooks/`) blocks completion until every gate is green and
  every review passes — you cannot declare a site "done" while it is red.

Generated sites use **Next.js (App Router) + Tailwind v4 tokens + Radix primitives**, scaffolded
from `templates/nextjs-starter/`, so the gates pass by construction.

## Foundations

- `docs/knowledge-base.md` — the located body of knowledge (21 domains, ~130 sub-disciplines, each
  with its canonical source and a `[GATE]`/`[JUDGMENT]` flag).
- `docs/architecture.md` — how that canon maps onto Claude Code plugin primitives.

## Status

**v0.1.0 — skeleton.** Plugin core (manifest, doctrine, spine commands, DoD Stop hook) and the
Next.js template are in place and locally validated. Next: the first skills, the first gate
subagents, and a marketing-landing-page pilot run end-to-end.

## Install (local dev)

Add this repo as a plugin marketplace/source in Claude Code, enable `site-builder`, then run
`/site-builder:brief` in a project to start a build.
