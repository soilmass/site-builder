# Site Builder — Implementation Guide

This guide turns [`build-spec.md`](./build-spec.md) into an ordered, verifiable build plan. It does
not restate the spec; it sequences it. Every milestone names what to build, the exact commands that
prove it works, and a machine-checkable Definition of Done. Where the guide and the spec disagree,
the spec wins — this document is the route, not the territory.

> **Read the spec first.** This guide assumes you know what §N refers to. Section numbers below point
> into `build-spec.md`.

---

## 0. Guiding principles (why the order is the order)

Three properties of the spec dictate the build order:

1. **The deterministic backbone must exist before anything it constrains.** The system's integrity
   rests on hooks and subagents that *mechanically* block bad work — not on the model choosing to
   behave. A skill written before the hook that enforces it is unenforced prose. So: **hooks →
   capture → validator → skills → jury → pipeline.** Enforcement precedes the thing enforced.

2. **Risky stack assumptions get proven against a real scaffold before we build machinery around
   them** (spec §3). Memory about Tailwind v4 config, shadcn-on-v4, `useGSAP` cleanup semantics,
   Lenis↔ScrollTrigger wiring, and Lighthouse-CI-against-`next start` is frequently stale. We spike
   these in Milestone 0 and write down the *verified* truths before they become load-bearing.

3. **Nothing is "done" until a real tool run shows it passing** (verification-before-completion).
   Every milestone below ends with commands whose output is the evidence. No milestone is closed on
   inspection alone.

**Build order at a glance:**

| M | Milestone | Closes toward system-DoD (§1) |
|---|---|---|
| 0 | Scaffold spike + stack-truths | de-risks §3 stack |
| 1 | Deterministic backbone: hooks, state, CLAUDE.md, settings | DoD (2) |
| 2 | Capture modes: regression + filmstrip | feeds §10, gates |
| 3 | Validator subagent + gate scripts | §9.1, §11 |
| 4 | Skills: new-site, design-direction, copy-voice, motion-choreography | §7, §6 |
| 5 | Jury subagent | §9.2 |
| 6 | Pipeline wiring: Phase 0–4, approvals, counters, CI | DoD (1), (4) |
| 7 | Calibration run | DoD (3) |
| 8 | Expressive demo site end-to-end | DoD (4) |

Milestones 1–5 are largely independent once M0 lands and can be parallelized across sessions; M6
integrates them; M7–M8 exercise the whole.

---

## Milestone 0 — Scaffold spike & stack-truths

**Goal.** Stand up a throwaway Next.js app that exercises every risky stack layer, then record the
verified versions and APIs into `design/references/stack-truths.md` (spec §3 says these truths are
discovered by running, not remembered).

**Why now.** Milestones 1–3 wrap enforcement around Tailwind tokens, `useGSAP`, and Lighthouse. If
any of those APIs differ from memory, the enforcement is built on sand. One hour of spiking saves
rework in three milestones.

**Steps.**
1. `npx create-next-app@latest` — App Router, TypeScript, no `src/` unless the team prefers it.
   Record the exact Next version.
2. Wire **Tailwind v4** (CSS-first: `@import "tailwindcss"` + `@theme`), pointing design tokens at
   CSS variables. Confirm an arbitrary-value class (`p-[13px]`) can be linted against later.
3. `npx shadcn@latest init`; add one primitive (`button`). Confirm the `components/ui/` path and that
   shadcn cooperates with Tailwind v4. This is the highest-uncertainty integration — verify it early.
4. `npm i gsap @gsap/react lenis`. Build **one throwaway pinned ScrollTrigger scene** using
   `useGSAP()`, with Lenis driving `ScrollTrigger.update` and Lenis raf wired into `gsap.ticker`
   (spec §12.2). Scroll it; confirm no double-scroll jank by eye and in a trace.
5. Confirm `useGSAP` cleanup kills ScrollTriggers on unmount (spec §12.4) — mount/unmount the scene
   and assert no leaked triggers.
6. Defer `SplitText`/`ScrollTrigger.refresh()` behind `document.fonts.ready` with a `next/font` face;
   confirm splitting doesn't run against the fallback font (spec §12.1).
7. Run **Lighthouse CI** against `next build && next start` (not dev). Confirm the local prod-build
   audit path works end-to-end.
8. Install Playwright + `@axe-core/playwright`; capture one screenshot and one axe pass.

**Definition of done.** `design/references/stack-truths.md` exists and records, with version numbers:
the Tailwind v4 token wiring that works, the shadcn-on-v4 result, the exact `useGSAP`+Lenis
integration snippet that scrolled clean, the `document.fonts.ready` gating pattern, and the working
Lighthouse-against-`next start` command. The spike app can be discarded; the truths cannot.

**Risks surfaced here:** gap-list item 4 (immersive shader reference library) can be noted but is not
blocking until an immersive project — leave a TODO in stack-truths.

---

## Milestone 1 — Deterministic backbone (hooks, state, CLAUDE.md, settings)

**Goal.** The enforcement skeleton: `.claude/CLAUDE.md`, `.claude/settings.json`, the three hook
scripts, and the `.claude/state/` machinery — all firing and blocking exactly as spec §8 specifies.

**Why now.** This is the single highest-leverage milestone. Every later milestone assumes these hooks
work. Build and *adversarially test* them before anything depends on them.

**Files.**
- `.claude/CLAUDE.md` — under 200 lines, contents per spec §13 (stack lock; phase/gate order; "no
  code outside `design/` before Gate 1"; token law; `components/ui/` read-only; all animation via
  `useGSAP`; registry-before-new-components; copy-rules pointer; 3-attempt-then-escalate contract).
- `.claude/settings.json` — hook wiring per the §8 event table.
- `.claude/hooks/protect-paths.sh` — PreToolUse. Blocks Edit/Write to `components/ui/*`, `.env*`,
  `tests/visual/*`, `.claude/state/approvals/*`, and post-approval `design/plan.md`; blocks Edit/Write
  outside `design/` while `approvals/gate1` is absent; **and** blocks the Bash side-door
  (`touch|cp|mv|>|>>|tee` targeting protected paths — spec §8 row 2, gap item 7); blocks
  `git push` to main.
- `.claude/hooks/post-edit-check.sh` — PostToolUse on `**/*.{ts,tsx,css}`: `tsc --noEmit`, ESLint
  (incl. jsx-a11y + arbitrary-value ban + motion-token-literal ban), exit 2 with `attempt N/3`.
- `.claude/hooks/stop-gate.sh` — Stop: guard on `stop_hook_active`; run Vitest + `next build`;
  increment counter and block on failure; on third failure allow stop and write the escalation report
  (§8.2), printing its summary to **stderr** so it surfaces in the conversation.
- `.claude/state/` — gitignored; holds attempt counters (`gate:page:section` keys), `approvals/`,
  session state.

**Script standards (spec §8.1), non-negotiable in every hook.** `set -euo pipefail`; parse input via
`jq -r`; quote all variables; set timeouts; no `eval`.

**TDD approach.** Before writing each hook, write a tiny test harness (`scripts/test-hooks.sh`) that
pipes representative PreToolUse/PostToolUse/Stop JSON payloads into the script and asserts the exit
code and stderr. Write the failing assertion first, then the hook.

**Verification (this is the DoD — spec DoD (2)).**
- `/hooks` shows all handlers registered.
- Manual triggers, each expected to **exit 2**: edit a file in `components/ui/`; edit any file outside
  `design/` while `approvals/gate1` is absent; agent attempts `touch .claude/state/approvals/gate1`;
  agent attempts `echo x >> tests/visual/foo.png` (Bash side-door); `git push` to main.
- Attempt counter increments across three failed Stop attempts, then the third writes
  `.claude/state/escalation-<gate>.json` and prints its summary to stderr.
- Counter **resets** when its gate passes and when the operator intervenes post-escalation (spec §5
  Phase 2) — test both reset paths explicitly; stale counters must never carry forward.

---

## Milestone 2 — Capture modes

**Goal.** The two deterministic capture pipelines the gates and jury consume (spec §10).

**Files.** `playwright.config.ts`, `lighthouserc.json`, and capture helpers under `tests/`.

**Regression mode** (deterministic pixels): force `prefers-reduced-motion: reduce`, disable Lenis,
await `networkidle` + `document.fonts.ready`, then `toHaveScreenshot`. This same run doubles as the
reduced-motion visual test. Shoot at 390 / 768 / 1280 / 1920.

**Filmstrip mode** (motion review): live page, CDP-scripted scroll at fixed velocity end-to-end,
video recorded, keyframes extracted via ffmpeg at each storyboard scene's declared start/mid/end
scroll positions. The review compares frame sets to storyboard rows, not to vibes.

**Verification (DoD).** Both modes run against the M0 spike page and produce artifacts:
`toHaveScreenshot` baselines at four widths, and a filmstrip whose extracted frames land at the
scroll positions you asked for. Confirm regression mode is byte-stable across two runs (fonts + Lenis
determinism).

---

## Milestone 3 — Validator subagent & gate scripts

**Goal.** `agents/validator.md` (isolated context; **Bash + Read only**) plus a real script behind
every check in the §9.1 matrix, so the validator returns only structured failures (gate, file/route,
measured value, threshold).

**Why before skills.** The validator is the objective judge of Phase 3. Building it before the
taste-skills means the skills are developed against a working referee.

**Checks to implement as scripts** (each must fail on a seeded violation and pass clean):
- `next build` → Playwright full matrix (4 viewports; Chromium local, +WebKit+Firefox in CI).
- axe-core WCAG 2.2 AA (zero violations) + Lighthouse a11y = 1.0.
- Lighthouse perf ≥ tier floor (§4), against `next build && next start`.
- Per-route first-load JS budget (§4 tier table; immersive excludes lazy 3D).
- Overflow/touch-target asserts: `scrollWidth ≤ innerWidth`; targets ≥ 44px.
- Registry coverage: any `components/**` file (excluding `components/ui/`) absent from
  `design/registry.md` fails (§7.5).
- Asset-manifest coverage: grep `app/` + `public/` against `design/assets.md`; unlisted raster fails;
  typographic-and-code-only briefs must have **zero** raster in `public/` (§6.5).
- Copy grep gate: ban `lorem ipsum|placeholder|your text here|TODO copy` in `app/` (§7.4).
- SEO/meta: per-route unique `title`+`description`, OG image, favicons, `sitemap.xml`, `robots.txt`.
- Security floor: CSP/HSTS/X-Content-Type-Options/Referrer-Policy in `next.config.ts` +
  `public/.well-known/security.txt`.
- Reduced-motion suite: emulate `prefers-reduced-motion`, assert each storyboard scene renders its
  declared static fallback (§12.6).

**Verification (DoD).** Seed one violation per check into a fixture app; run the validator; confirm it
reports exactly those failures in the structured shape and nothing else. Then clean the fixture and
confirm an all-green return. Confirm the validator has no Write/Edit tools.

---

## Milestone 4 — Skills

**Goal.** The four skills of §7 and the Gate 1 artifact schemas/templates of §6.

**Files.**
- `skills/new-site/SKILL.md` — `disable-model-invocation: true` (side effects). Owns Phase 0; refuses
  to scaffold without a complete brief; ≥ 3 references; captures the three fields the spec calls out
  (page list, asset source, font source).
- `skills/design-direction/SKILL.md` — Phase 1 artifacts + the §7.2 six-item pass/fail rubric, reused
  in the Phase 2 screenshot review. Produces **three divergent directions**, each self-critiqued
  against the three AI-default looks and the reference analyses before presentation; compiles the
  chosen direction into `design/tokens.css` + `design/motion-tokens.ts` on approval.
- `skills/copy-voice/SKILL.md` — the §7.4 voice rules; the deterministic grep gate lives in the
  validator (M3), the drafting rules live here.
- `skills/motion-choreography/SKILL.md` — preloaded when tier ≥ expressive; the §12 non-negotiables,
  the storyboard contract, and worked `useGSAP`+ScrollTrigger+Lenis patterns from the M0 truths. All
  animation via `useGSAP()` — bare `useEffect` animation banned.
- Schema templates (§6): `design/plan.md` field template, `design/motion-tokens.ts` **starter set**
  (`reveal-soft`, `reveal-sharp`, `pin-scrub`, `micro-press`, `fade-ambient` — flagged TBD pending
  §14 calibration), `design/storyboard.md` table (reduced-motion column mandatory per scene),
  `design/assets.md` row template.

**Verification (DoD).** Run `design-direction` against a small test brief. Confirm it emits three
directions, each carrying every §6.1 field including an explicit `divergence` statement, and that any
direction failing to state divergence is revised before presentation. Confirm the motion-token literal
ban (M1 post-edit hook) fires when a `gsap.to` uses a numeric duration instead of a token import.

---

## Milestone 5 — Jury subagent

**Goal.** `agents/jury.md`: fresh context, receiving only `design/brief.md`, breakpoint screenshots,
and the filmstrip — no build history, no plan.

**Contents (§9.2).** Awwwards axes and weights (design 40 / usability 30 / creativity 20 /
content 10); the full anchor table (the excerpt in the spec is a starting point); the
evidence-citation requirement (every score cites frame numbers or screenshot filenames — no evidence,
score invalid); the 60-image input budget with hero + signature scenes always included; dual-run as
two independent invocations with any axis differing > 1.5 flagged unstable and routed to the operator;
pass threshold weighted average ≥ 6.5 on **both** runs.

**Verification (DoD).** Structural first: feed a known screenshot set and confirm the output shape
(per-axis scores with cited evidence, weighted average, stability flag). Full behavioral validation is
Milestone 7. Do **not** tune the 6.5 threshold here — spec §14 is explicit that calibration tunes
*anchor language*, not the threshold.

---

## Milestone 6 — Pipeline wiring (Phase 0–4, approvals, counters, CI)

**Goal.** Connect the pieces into the Phase 0–4 pipeline with the human gates, attempt counters, and
CI mirror.

**Wiring points.**
- **Phase 0–1:** `/new-site` runs brief intake → reference fetch/analysis → scaffold. Gate 1 approval
  is a marker the agent cannot create: operator runs `touch .claude/state/approvals/gate1` in their
  own terminal (M1 hooks enforce this).
- **Phase 2 section loop:** section = named region of the approved wireframe (agent may not invent
  sections). Per section: draft copy → build → post-edit hooks → regression screenshots at four
  widths → §7.2 self-critique → (expressive+) filmstrip at 390/1280 vs storyboard rows → Vitest.
  Counters keyed `gate:page:section`, reset on pass or operator intervention.
- **Phase 3:** validator runs the full matrix; on green, jury scores; < 6.5 or unstable feeds back;
  three failures escalate with the scorecard.
- **Phase 4 → Gate 2:** operator reviews Vercel preview, then `touch .claude/state/approvals/gate2`
  and runs `pnpm baselines:capture` from their own terminal. Baselines land read-only to the agent.
- **SessionStart(compact)** hook re-injects current phase, gate status, attempt counters.
- **CI** (`.github/workflows/ci.yml`): mirrors the Phase 3 set against the Vercel preview with the
  full browser matrix, **except** the smoothness gate (DevTools MCP, local-only) — CI substitutes a
  Playwright trace check for long tasks > 100ms during scripted scroll.

**Verification (DoD — spec DoD (1)).** Run `/new-site` on a real brief end-to-end through Phase 0–2 on
a one-page site: confirm the pipeline halts at Gate 1 until the marker exists, resumes after, and that
attempt counters and escalation reports behave under a deliberately-failing section.

---

## Milestone 7 — Calibration run (§14)

**Goal.** Prove the jury's taste matches the operator's. Score 5 known awwwards SOTD winners and 5
known-mediocre sites through the jury (screenshots + scripted-scroll filmstrips, captured identically
via M2). The jury's ranking must match the operator's ranking. **Tune anchor language, not the
threshold, until it does.**

**Blocked on:** gap-list item 3 — the operator must name the ten sites. Surface this as an operator
decision before starting (see Open Decisions below).

**Verification (DoD — spec DoD (3)).** Jury ranking of the ten matches the operator's ranking; the
anchor language edits that achieved it are committed; the 6.5 threshold is unchanged.

---

## Milestone 8 — Expressive demo site, end-to-end

**Goal.** Drive one expressive-tier demo site through the whole pipeline: all Phase 3 gates green,
jury average ≥ 6.5 stable, baselines locked at Gate 2, with **exactly two human approvals** (Gate 1
and Gate 2) and no others.

**Verification (DoD — spec DoD (4), and per-site DoD §1).** All Phase 3 gates green in CI against the
Vercel preview; jury ≥ 6.5 on both runs with no axis flagged unstable; visual baselines locked;
preview approved. Count the human approvals — exactly two.

---

## Appendix A — Risk register (gap list §15, mapped to when it closes)

| # | Gap | Closes at |
|---|---|---|
| 1 | Jury 6.5 uncalibrated | M7 calibration run |
| 2 | Motion-token starter values are educated defaults | M8 (do they read as intentional in the first filmstrip?) |
| 3 | Calibration set unnamed | **Operator decision, before M7** |
| 4 | No immersive shader reference library | Noted in M0; blocks only an immersive project |
| 5 | Dual-run jury doubles Phase 3 cost | Operating decision post-M7 (single-run once stability proven?) |
| 6 | Art direction of operator/stock imagery ungated beyond jury | Operating decision — add image-direction rubric row or accept jury coverage |
| 7 | Bash side-door: exotic writes (`tee`, `dd`, scripting langs) | Mitigated in M1 (defense-in-depth); operator decides if filesystem-permission sandbox is wanted |

Items 1–3 close during the calibration arc. Item 4 blocks only immersive-tier work. Items 5–7 are
operating decisions, not build blockers.

## Appendix B — Open decisions requiring operator input

1. **Calibration set (gap 3):** which ten sites (5 SOTD winners, 5 mediocre)? Blocks M7.
2. **Package manager:** the spec references both `npm`/`npx` (§5) and `pnpm baselines:capture` (§4).
   Pick one and make it consistent across scripts and hooks before M6.
3. **Jury cost (gap 5):** keep dual-run permanently, or drop to single-run after calibration proves
   stability?
4. **Image art-direction gate (gap 6):** add a rubric row or accept jury coverage?
5. **Sandbox posture (gap 7):** rely on hook guardrails, or additionally deny protected paths via
   filesystem permissions?

## Appendix C — Verification-before-completion checklist (applies to every milestone)

- [ ] Real tool run executed; output captured, not inferred.
- [ ] The failing case was demonstrated failing before the passing case was demonstrated passing.
- [ ] Hooks/gates tested adversarially (seeded violation → correct block), not just on the happy path.
- [ ] No gate reports `pass` unless it actually ran.
- [ ] Committed in a coherent phase with a clear message. No PR unless asked.
