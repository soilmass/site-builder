# Site Builder — Build Specification

An agentic website-production system running on Claude Code. It scaffolds Next.js sites with prebuilt CLIs, enforces design taste through gated artifacts and token law, choreographs motion through GSAP/Lenis under a storyboard contract, and loops every build through deterministic validation until it passes an awwwards-calibrated jury gate or escalates to the operator.

---

## 1. Frame

**Executor.** Claude Code, building this system as a project-level `.claude/` setup (convertible to a plugin later). At runtime, Claude Code is also the site-building agent the system constrains.

**Known executor weaknesses this spec defends against.** Animation choreography, motion timing calibration, visual taste drift toward AI-default looks, silent gap-filling, declaring done on failing work, generic copy.

**Definition of done for the system.** A repo where: (1) `/new-site` runs the full Phase 0–4 pipeline on a real brief; (2) every hook fires and blocks as specified, verified via `/hooks` and manual triggers; (3) the jury subagent completes the calibration run (§14) and its rankings match the human ranking of the calibration set; (4) one expressive-tier demo site passes all gates end-to-end with exactly two human approvals.

**Definition of done per site.** All Phase 3 gates green, jury average ≥ 6.5 with stable scores, visual baselines locked at Gate 2, deployed preview approved by the operator.

---

## 2. System overview and repo layout

```
.claude/
  CLAUDE.md                      # always-on rules, < 200 lines
  settings.json                  # hooks wiring
  skills/
    new-site/SKILL.md            # /new-site — brief intake + scaffold
    design-direction/SKILL.md    # Gate 1 artifact production + critique rubric
    motion-choreography/SKILL.md # GSAP/Lenis patterns, storyboard contract
    copy-voice/SKILL.md          # copy drafting rules
  agents/
    validator.md                 # full-suite validation, isolated context
    jury.md                      # awwwards-style scoring, fresh context
  hooks/
    post-edit-check.sh           # tsc + lint + token conformance on touched file
    protect-paths.sh             # blocks edits to components/ui/, .env, baselines
    stop-gate.sh                 # test suite + attempt counter + escalation
  state/                         # gitignored: attempt counters, session state
design/
  brief.md                       # Phase 0 output
  plan.md                        # approved design plan (Gate 1)
  tokens.css                     # compiled design tokens
  motion-tokens.ts               # typed motion tokens
  storyboard.md                  # approved motion storyboard (Gate 1)
  registry.md                    # component registry
  references/                    # fetched reference screenshots + analysis
tests/
  e2e/                           # Playwright specs
  visual/                        # locked baselines (Gate 2)
lighthouserc.json
playwright.config.ts
.github/workflows/ci.yml
```

---

## 3. Stack (locked)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) via `create-next-app` | |
| Styling | Tailwind v4 + CSS variables from `design/tokens.css` | |
| Components | shadcn/ui via `npx shadcn@latest` | primitives read-only after install |
| Animation | GSAP + `@gsap/react` (`useGSAP`), ScrollTrigger, SplitText | premium plugins now free |
| Smooth scroll | Lenis | expressive + immersive tiers only |
| 3D / shaders | Three.js via `@react-three/fiber`, dynamically imported | immersive tier only |
| Page transitions | View Transitions API with full-reload fallback | |
| Fonts | `next/font`, self-hosted, preloaded | |
| Unit tests | Vitest + React Testing Library | |
| E2E / capture | Playwright (+ axe-core via `@axe-core/playwright`) | |
| Perf audit | Lighthouse CI; Chrome DevTools MCP for traces | |
| Browser feedback | Playwright MCP (screenshots, scripted interaction, video) | |
| Deploy | Vercel; preview deploys are the CI validation target | |

---

## 4. Project tiers

Set once at Phase 0 in `design/brief.md`. Selects budgets, motion depth, and loaded stack layers.

| | clean | expressive | immersive |
|---|---|---|---|
| Motion | token-based reveals only | Lenis + ScrollTrigger scenes + SplitText | adds Three.js/shader scenes |
| Lighthouse perf floor | 0.90 | 0.85 | 0.85 |
| First-load JS (gzip, per route) | 250 KB | 300 KB | 300 KB + lazy-mounted 3D excluded from budget |
| Storyboard required | no (token table only) | yes | yes |
| Filmstrip review | no | yes | yes |
| Accessibility | 1.0, always | 1.0, always | 1.0, always |

---

## 5. Pipeline

### Phase 0 — Brief intake (`/new-site`)
Interrogates the operator once: subject, audience, tone, tier, 3–5 named reference sites, any locked visual direction, plus three fields the first draft of this spec orphaned — **page list** (every route with its single job; a one-pager is a page list of one), **asset source** (operator-supplied files / licensed stock the operator names / typographic-and-code-only, meaning all visual interest comes from type, CSS, and WebGL — no raster imagery), and **font source** (open-license via next/font, or licensed files the operator supplies; the agent never sources display faces itself). Writes `design/brief.md`. Fetches and screenshots each reference; writes per-reference analysis to `design/references/` covering type-scale ratios, palette, motion timing, layout devices, pacing — the *why*, not just the *what*. Then scaffolds: `create-next-app` → Tailwind → `shadcn init` → GSAP/Lenis install per tier → test tooling → hook wiring.

### Phase 1 — Design plan → **Human Gate 1**
The design-direction skill produces **three divergent directions**. Each direction contains, at schema level (§6): token set, type pairing, layout concept with ASCII wireframe, signature element, hero copy sample, and (expressive/immersive) motion tokens + storyboard. Before presenting, each direction is self-critiqued against the AI-default looks (warm-cream/serif/terracotta; near-black/acid-accent; broadsheet hairlines) and against the reference analyses — any direction that fails to state how it diverges from both is revised. Operator picks one and redlines; the skill revises and re-presents until the operator approves (no round limit — this gate is where taste is decided). **Approval is a marker file the agent cannot create: the operator runs `touch .claude/state/approvals/gate1` in their own terminal.** The protect hook blocks all agent writes to `.claude/state/approvals/`, and a PreToolUse hook blocks writes outside `design/` until the marker exists. On approval, the design-direction skill compiles the chosen direction into `design/tokens.css` and `design/motion-tokens.ts` — the plan is prose; the tokens files are the enforceable law derived from it.

### Phase 2 — Section build loop
**A section is a named region of the approved wireframe** — the approved plan's wireframes define the exhaustive, ordered section list per page; the agent may not invent sections. Multi-page sites run Phase 1 once (shared tokens, shared type system) with a wireframe and storyboard per page. Per section: draft copy from brief under copy-voice rules → build → PostToolUse hooks (tsc, ESLint, token conformance) fire on every edit → regression-mode screenshots at 390/768/1280/1920 → self-critique against the rubric (§7.2) → (expressive+) filmstrip capture at 390 and 1280 reviewed against the storyboard rows for that section → Vitest. Every gate carries a 3-attempt counter in `.claude/state/`, keyed `gate:page:section`; exit-2 feedback includes `attempt N/3`. **Counters reset when their gate passes or when the operator intervenes after an escalation** — stale counters from a previous section never carry forward. Third failure: Stop hook permits stopping, writes the escalation report (§8.2), and prints its summary to stderr so it surfaces in the conversation rather than sitting silently on disk.

### Phase 3 — Full-site validation
Validator subagent (§9.1) runs the complete matrix. Same 3-and-escalate rule. On green, the jury subagent (§9.2) scores the site. Jury average < 6.5, or unstable axes, feeds critique back into the loop; three jury failures escalates with the scorecard.

### Phase 4 — Baseline lock → **Human Gate 2**
Operator reviews the Vercel preview, then runs `touch .claude/state/approvals/gate2` and the baseline-capture script (`pnpm baselines:capture`) from their own terminal: regression-mode `toHaveScreenshot` baselines written to `tests/visual/`, which the protect hook keeps read-only to the agent from session start. All subsequent edits run visual regression against them. **Intentional redesigns later:** operator deletes the gate2 marker (reverting affected pages to Phase 2 rules) and re-runs the capture script after re-approval — the agent never updates baselines itself.

---

## 6. Gate 1 artifact schemas

### 6.1 Design plan (`design/plan.md`)
Required fields per direction: `name`, `thesis` (one sentence), `palette` (4–6 named hex values with role: bg / surface / ink / accent / etc.), `type` (display face, body face, utility face; scale ratio; weights), `layout` (one-paragraph concept + ASCII wireframe), `signature` (the one element the site is remembered by, describable in one sentence to someone who hasn't seen it), `divergence` (how this differs from the references and from the AI-default looks), `hero-copy` (headline + subhead, real copy).

### 6.2 Motion tokens (`design/motion-tokens.ts`)
```ts
export type MotionToken = {
  name: string;        // e.g. "reveal-soft"
  duration: number;    // seconds
  ease: string;        // GSAP ease string, e.g. "power3.out"
  distance?: number;   // px, translate axis distance
  stagger?: number;    // seconds between items
};
```
Starter set shipped with the skill: `reveal-soft` (0.8s, power3.out, y:32, stagger:0.08), `reveal-sharp` (0.5s, power4.out, y:24, stagger:0.05), `pin-scrub` (scrub-linked, no duration), `micro-press` (0.15s, power2.out, scale 0.97), `fade-ambient` (1.2s, sine.inOut). `[TBD — starter values need taste validation during the calibration run]`. Lint rule: any `gsap.to/from/timeline` call using numeric literals for duration/ease instead of a token import fails the post-edit hook.

### 6.3 Motion storyboard (`design/storyboard.md`)
One row per scene:

| scene | trigger element | scroll start→end | pinned | layers (element → token) | exit behavior | reduced-motion fallback |
|---|---|---|---|---|---|---|

The reduced-motion column is mandatory per scene and must describe a designed static state, not "animation off."

### 6.4 Hero copy
Judged at Gate 1 alongside visuals so voice and design are approved together. Rules in §7.4.

### 6.5 Asset manifest (`design/assets.md`)
One row per visual asset: filename, source (per the brief's asset-source field), license/attribution, intended placement, focal point for cropping. Rules: all raster imagery served through `next/image` with AVIF/WebP and declared dimensions (CLS); no hotlinking; no asset outside the manifest ships (validator greps `app/` and `public/` against it). If the brief's asset source is typographic-and-code-only, the manifest is empty by design and any raster file in `public/` fails Phase 3.

---

## 7. Skills

### 7.1 `new-site`
User-invoked (`disable-model-invocation: true` — it has side effects). Owns Phase 0. Refuses to scaffold without a complete brief; every brief field is required, references minimum three.

### 7.2 `design-direction`
Owns Phase 1 artifacts and the self-critique rubric used in both Phase 1 and the Phase 2 screenshot review. Rubric — pass/fail per item, per screenshot:

1. Every color/spacing/type value traces to a token; nothing arbitrary.
2. Spacing sits on the scale; rhythm consistent between sections.
3. Hierarchy legible at 390px; no clipped or orphaned text.
4. Signature element present and doing its job on this viewport.
5. No AI-default tells (the three looks in §5 Phase 1, plus gratuitous gradients, numbered markers without sequence meaning).
6. Copy is specific to the subject, not transplantable to a competitor's site.

### 7.3 `motion-choreography`
Preloaded (not user-invoked) whenever tier ≥ expressive. Contains the engineering rules of §12 as non-negotiables, the storyboard contract, and worked `useGSAP` + ScrollTrigger + Lenis patterns. All animation code goes through `useGSAP()` — no bare `useEffect` animation, ever.

### 7.4 `copy-voice`
Active voice; controls named by what the user controls; one action keeps one name through a flow; errors state what happened and how to fix it; no filler, no hype adjectives. Sentence-level specificity: copy must reference the subject's actual world (materials, process, vocabulary from the brief). Deterministic gate: grep ban on `lorem ipsum|placeholder|your text here|TODO copy` anywhere in `app/`.

### 7.5 Design-system registry (`design/registry.md`)
Every component pattern gets a row: name, file, variants, where used, token dependencies. Enforcement is the validator's: any component file under `components/` (excluding `components/ui/`) absent from the registry fails Phase 3. Sections must consult the registry before creating a new pattern; a near-duplicate of an existing pattern is a critique-rubric failure.

---

## 8. Hooks (`.claude/settings.json` + `.claude/hooks/`)

| Event | Matcher / if | Handler | Behavior |
|---|---|---|---|
| PreToolUse | `Edit\|Write` on `components/ui/*`, `.env*`, `tests/visual/*`, `.claude/state/approvals/*`, `design/plan.md` post-approval | `protect-paths.sh` | exit 2 + reason |
| PreToolUse | `Bash` writing to any protected path (`if` rules on `touch\|cp\|mv\|>>?` targeting them) | `protect-paths.sh` | exit 2 — closes the Bash side-door around Edit/Write protection |
| PreToolUse | `Edit\|Write` outside `design/` while `approvals/gate1` absent | `protect-paths.sh` | exit 2: "Gate 1 not passed" |
| PreToolUse | `Bash(git push*)` on main | inline | exit 2 |
| PostToolUse | `Edit\|Write` on `**/*.{ts,tsx,css}` | `post-edit-check.sh` | `tsc --noEmit` (project), ESLint incl. jsx-a11y + arbitrary-value ban, motion-token literal ban; exit 2 with `attempt N/3` on failure |
| Stop | — | `stop-gate.sh` | guard on `stop_hook_active`; runs Vitest + `next build`; on failure increments counter and blocks with feedback; on third failure allows stop and writes escalation report |
| SessionStart | `compact` | inline echo | re-injects: current phase, gate status, attempt counters |

### 8.1 Script standards
All hook scripts: `set -euo pipefail`, input parsed via `jq -r`, variables quoted, timeouts set, no `eval`.

### 8.2 Escalation report schema (`.claude/state/escalation-<gate>.json`)
```json
{
  "gate": "lighthouse-perf",
  "attempts": 3,
  "diffs_tried": ["dynamic-imported hero scene", "swapped SplitText for CSS clip reveal", "deferred Lenis init"],
  "hypothesis": "GSAP+Lenis+Three first-load exceeds route budget regardless of split strategy",
  "recommended_decision": "raise route budget to 340KB or cut the shader scene to a static render"
}
```
It lands as a decision, not an investigation.

---

## 9. Subagents

### 9.1 `validator`
Isolated context; tools: Bash, Read only. Runs: `next build` → Playwright full matrix (4 viewports; Chromium locally, Chromium+WebKit+Firefox in CI) → axe-core WCAG 2.2 AA → Lighthouse CI against local prod build (`next build && next start`) → per-route bundle check → registry coverage → asset-manifest coverage → copy grep gate → SEO/meta check (per-route `metadata` with unique title + description, OG image, favicon set, sitemap.xml, robots.txt) → security floor (headers in `next.config.ts`: CSP, HSTS, X-Content-Type-Options, Referrer-Policy; `public/.well-known/security.txt`) → reduced-motion suite (emulated `prefers-reduced-motion`, asserts each storyboard scene renders its declared fallback). Returns only failures, structured: gate, file/route, measured value, threshold.

### 9.2 `jury`
Fresh context; receives only `design/brief.md`, breakpoint screenshots, and the filmstrip. No build history, no plan. Scores 1–10 on the awwwards axes and weights: design 40%, usability 30%, creativity 20%, content 10%. Anchors (excerpt — full table lives in the agent file):

- Design 6: coherent tokens, correct hierarchy, forgettable. Design 8: one choice not seen this month, executed cleanly.
- Creativity scored on whether the signature element survives being described in one sentence to someone who hasn't seen the site.
- Usability: penalize jank, dead scroll zones, unclear affordances visible in the filmstrip.
- Content: scored against the brief's audience, not generic polish.

Input budget: breakpoint screenshots plus at most 3 frames per storyboard scene, capped at 60 images total — larger sites get scenes sampled, hero and signature scenes always included. Every score must cite evidence — frame numbers or screenshot filenames. No evidence, score invalid. Runs twice as two independent invocations (fresh context each; sampling variance is the mechanism — there is no seed parameter); any axis differing by > 1.5 is flagged unstable and routed to the operator. Pass threshold: weighted average ≥ 6.5 on both runs.

---

## 10. Capture modes

**Regression mode** (deterministic pixels): forces `prefers-reduced-motion: reduce`, Lenis disabled, `networkidle` + `document.fonts.ready` awaited, then `toHaveScreenshot`. Doubles as the reduced-motion visual test.

**Filmstrip mode** (motion review): live page, CDP-scripted scroll at fixed velocity end-to-end, video recorded; keyframes extracted at each storyboard scene's declared start/mid/end scroll positions via ffmpeg. Review compares each frame set to its storyboard row — not to vibes.

---

## 11. Gate table

| Gate | Tool | Threshold | Class | When |
|---|---|---|---|---|
| Types | tsc | zero errors | hard | every edit |
| Lint + a11y-static + token law | ESLint | zero errors | hard | every edit |
| Unit | Vitest | all pass | hard | Stop hook |
| Build | next build | success | hard | Stop hook |
| E2E flows | Playwright | all pass, 4 viewports | hard | Phase 3 |
| Overflow / touch targets | Playwright asserts | scrollWidth ≤ innerWidth; targets ≥ 44px | hard | Phase 3 |
| Accessibility | axe-core | zero WCAG 2.2 AA violations; Lighthouse a11y = 1.0 | hard | Phase 3 |
| Performance | Lighthouse | ≥ tier floor (§4) | hard | Phase 3 |
| Smoothness | DevTools MCP trace during scripted scroll | no long task > 100ms inside pinned scenes; dropped frames ≤ 5%; no pin-induced CLS | hard, expressive+ | Phase 3 |
| Bundle | size check | ≤ tier budget per route | hard | Phase 3 |
| Registry / assets / copy grep | validator | full coverage / zero hits | hard | Phase 3 |
| SEO / meta | validator | unique title+description, OG image, sitemap, robots, favicons per route | hard | Phase 3 |
| Security floor | validator | headers + security.txt present | hard | Phase 3 |
| Jury | jury subagent | ≥ 6.5 weighted, stable | hard | Phase 3 |
| Visual regression | toHaveScreenshot | zero diffs vs. locked baselines | hard | post-Gate 2 only |

Every gate: 3 attempts, then escalation report. CI (`.github/workflows/ci.yml`) mirrors the Phase 3 set against the Vercel preview deploy with the full browser matrix — except the smoothness gate, which depends on Chrome DevTools MCP and runs locally only; CI substitutes a Playwright trace check for long tasks > 100ms during the scripted scroll, which approximates but does not replace the local gate.

---

## 12. Engineering rules (motion-choreography non-negotiables)

1. Fonts self-hosted via `next/font` and preloaded. All SplitText and ScrollTrigger initialization deferred behind `document.fonts.ready`; `ScrollTrigger.refresh()` after image settle. Splitting against a fallback font is a silent wrong-animation bug.
2. Lenis drives GSAP: `lenis.on('scroll', ScrollTrigger.update)` and Lenis raf wired into `gsap.ticker`. Two competing scroll loops read as jank in the filmstrip.
3. Pinned scenes reserve spacer dimensions up front — pin-spacer insertion must not shift layout (the smoothness gate measures this).
4. Every `useGSAP` scope cleans itself; ScrollTriggers are killed on unmount (automatic under `useGSAP`, which is why bare `useEffect` is banned).
5. Three.js scenes: dynamic import, lazy mount on approach, unmount + context dispose on exit. Never in first-load JS.
6. Every scene implements its storyboard reduced-motion fallback; the global `prefers-reduced-motion` check gates timeline creation, not playback speed.

---

## 13. CLAUDE.md contents (summary)

Stack lock; phase/gate order; "no code outside design/ before Gate 1 approval"; token law (no arbitrary Tailwind values, no hex outside tokens.css, no motion literals); `components/ui/` read-only; all animation via `useGSAP`; consult registry before new components; copy rules pointer; 3-attempt-then-escalate contract. Under 200 lines — everything deeper lives in skills.

---

## 14. Calibration run (first task after the system builds)

Score 5 known awwwards SOTD winners and 5 known-mediocre sites through the jury subagent (screenshots + scripted-scroll filmstrips captured the same way). The jury's ranking must match the operator's ranking of the same ten. Tune anchor language — not the threshold — until it does. `[TBD — calibration set: operator to name the ten sites]`.

---

## 15. Gap list

| # | Gap | Class | Question that closes it |
|---|---|---|---|
| 1 | Jury threshold 6.5 is uncalibrated against human juror taste | method | Does the §14 run rank the calibration set correctly? |
| 2 | Motion-token starter values are educated defaults | quality-word residue | Do they read as intentional in the first demo build's filmstrip? |
| 3 | Calibration set unnamed | orphan | Which ten sites? |
| 4 | Immersive-tier shader work has no reference library named | weakness zone | Pick a versioned exemplar set (e.g. specific @react-three/drei demos) before first immersive project |
| 5 | Dual-run jury doubles Phase 3 cost | tradeoff | Acceptable, or single-run after calibration proves stability? |
| 6 | If asset source is operator-supplied or stock, art direction of imagery (selection, crops, pairing with type) has no gate beyond the jury | weakness zone | Add an image-direction row to the critique rubric, or accept jury coverage? |
| 7 | Bash side-door hook rules (§8) enumerate common write commands; exotic writes (`tee`, `dd`, scripting languages) could still bypass | method | Accept as defense-in-depth (protection is a guardrail, not a sandbox), or run the agent with filesystem permissions denying those paths? |

Items 1–3 close during the calibration run. Item 4 blocks only immersive-tier projects. Items 5–7 are operating decisions, not blockers.
