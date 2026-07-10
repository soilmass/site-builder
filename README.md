# site-builder

A **Claude Code plugin** that builds high-end, tested **Next.js** websites — with taste and
validation built in. It is to websites what [superpowers](https://github.com/obra/superpowers) is
to software development, and it **composes with superpowers** rather than reinventing it.

## Design stance: invent as little as possible

site-builder is a thin *website-production* layer over de facto tools:

- **Methodology** — composes with **superpowers** (`/brainstorm`, `/write-plan`, `/execute-plan`,
  verification, `code-reviewer`).
- **Scaffold** — **`create-next-app`** (Next.js App Router + Tailwind v4 + TS).
- **Components + theming** — **shadcn/ui** (Base UI + Tailwind, accessible, source you own).
- **Gates** — thin wrappers over **Lighthouse CI**, **`@axe-core/playwright`**, **html-validate**,
  **CO2.js**.

What remains ours: the website taste/gate *knowledge* skills, the **Definition-of-Done Stop hook**,
the thin orchestration wiring the tools into a workflow, and the gate configs.

## How it works

A seven-command **spine** takes a site from brief to shipped:

```
/site-builder:brief → plan → tokens → build → verify → review → ship
```

- **Skills** (`skills/`) carry the `[JUDGMENT]` craft (taste, IA, content, motion) and the runtime
  doctrine (`skills/site-builder/`), which auto-activates.
- **Gate subagents** (`agents/`) drive the de facto CLIs and return pass/fail.
- **Judgment reviewers** apply what tools can't: taste, manual accessibility, content.
- A **Definition-of-Done Stop hook** (`hooks/`) blocks completion until every gate is green and
  every review passes — you cannot declare a site "done" while it is red.

## Foundations

- `docs/knowledge-base.md` — the located body of knowledge (21 domains, each source flagged
  `[GATE]`/`[JUDGMENT]`).
- `docs/architecture.md` — how the canon maps onto Claude Code primitives (§14 = the invent-less ledger).

## Status

**v0.1.x — skeleton + invent-less rework.** Plugin core (manifest, doctrine skill, spine commands,
DoD Stop hook), the scaffold recipe, and the gate overlay are in place and locally validated. Next:
the first craft skills + gate subagents, then a marketing-landing-page pilot that runs the real
`create-next-app` + `shadcn` scaffold end-to-end.

## Install (local dev)

Install **superpowers** and **site-builder** as plugins in Claude Code (add this repo as a plugin
source via `.claude-plugin/marketplace.json`), enable both, then run `/site-builder:brief` in a
project to start a build.
