# site-builder — working in this repo

This repo is a **Claude Code plugin** that builds high-end, tested Next.js websites. It is being
**rebuilt from v1 to v2**.

## Start here — one document

**Read [`docs/v2-build-spec.md`](docs/v2-build-spec.md) before doing anything.** It is self-contained
and is the single source of truth for what to build, how, and the definition of done. You do not need
any other file to build v2 — do not depend on the other `docs/` files.

## The one thing that must not be lost

v2 exists to **make the Definition of Done real**: a **deterministic gate runner** (`npm run gates`) —
not the model — decides pass/fail by executing real gates across every route and both themes and
writing `.site/reports/summary.json`; the Stop hook reads that machine artifact, never model prose. A
gate never reports `pass` unless it actually ran and passed. Build that runner first (spec §2, §4.1).

## How to work here

- Use **superpowers**: `/brainstorm` ambiguities → `/write-plan` → `/execute-plan` with **TDD**
  (failing check first, then implement) → **verification-before-completion** (never claim done without
  running the real tools and showing output).
- **Prove risky assumptions against a real scaffold early** — memory is often wrong about current
  tool versions/APIs (the spec §3 lists verified stack truths; expect more, discover them by running).
- Commit in coherent phases with clear messages. **Do not open a PR unless asked.**
- Runtime plugin doctrine lives in `skills/site-builder/SKILL.md` (a plugin-root `CLAUDE.md` does not
  load at plugin runtime); this file governs only development *in this repo*.
