# site-builder — Architecture Blueprint

> How the located body of knowledge (`docs/knowledge-base.md`) becomes a **Claude Code
> plugin** that builds high-end, tested **Next.js** websites with taste and validation
> built in. This is the design; no plugin code is written yet.
>
> Model: obra/superpowers (methodology-as-composable-skills + a verification spine),
> retargeted from "software development" to "high-end website production."

---

## 1. Core principles

1. **The runtime is Claude Code.** The builder is not an app — it is a *plugin* assembled
   from Claude Code primitives (commands, skills, subagents, hooks, CLAUDE.md, output style).
2. **Two kinds of knowledge, two kinds of primitive.** The `[JUDGMENT]` layers of the BoK
   become **skills** (auto-activating knowledge + checklists); the `[GATE]` layers become
   **subagents** that run a tool and return pass/fail.
3. **Evidence over claims (the superpowers spine).** Nothing is "done" until gates are green
   *and* judgment reviews pass. This is enforced mechanically by a **Stop hook**, not by good
   intentions.
4. **Taste is codified, not vibed.** A standing taste kernel (Refactoring UI + NN/g's 5 +
   a token system) lives in CLAUDE.md and the `visual-taste` skill, applied every build.
5. **One stack, concrete gates.** Targeting **Next.js (App Router)** lets every gate be a real
   command against a real build — no stack-agnostic hand-waving.

---

## 2. Plugin package layout

```
site-builder/                          # the plugin repo (this repo)
├── .claude-plugin/
│   ├── plugin.json                    # manifest (name required)
│   └── marketplace.json               # self-distribution entry
├── commands/                          # THE SPINE — ordered workflow (namespaced /site-builder:*)
│   ├── brief.md
│   ├── plan.md
│   ├── tokens.md
│   ├── build.md
│   ├── verify.md
│   ├── review.md
│   └── ship.md
├── skills/                            # [JUDGMENT] layers — auto-activate during work
│   ├── visual-taste/SKILL.md
│   ├── design-tokens/SKILL.md
│   ├── information-architecture/SKILL.md
│   ├── content-design/SKILL.md
│   ├── ux-writing/SKILL.md
│   ├── interaction-motion/SKILL.md
│   ├── component-craft/SKILL.md       # Next.js + headless a11y primitives
│   ├── responsive-layout/SKILL.md
│   ├── acceptance-criteria/SKILL.md   # Gherkin authoring
│   └── ethical-design/SKILL.md        # dark-pattern avoidance, consent, privacy
├── agents/                            # [GATE] runners + [JUDGMENT] reviewers (subagents)
│   ├── a11y-gate.md
│   ├── performance-gate.md
│   ├── semantics-gate.md
│   ├── security-gate.md
│   ├── seo-gate.md
│   ├── visual-regression-gate.md
│   ├── tokens-gate.md
│   ├── acceptance-gate.md
│   ├── sustainability-gate.md
│   ├── taste-reviewer.md              # judgment, run in isolation for an independent eye
│   ├── a11y-manual-reviewer.md        # the ~60% axe can't catch
│   └── content-reviewer.md
├── hooks/
│   └── hooks.json                     # Stop hook = Definition-of-Done gate; PostToolUse = format
├── scripts/                           # gate implementations the subagents call
│   ├── run-a11y.mjs   run-lighthouse.mjs   check-headers.mjs
│   ├── validate-html.mjs   build-tokens.mjs   check-carbon.mjs   …
├── templates/
│   └── nextjs-starter/                # the scaffold new sites are generated from
├── output-styles/
│   └── site-craft.md                  # optional tone: evidence-first, taste-aware
├── CLAUDE.md                          # taste kernel + Next.js conventions + Definition of Done
└── docs/                              # knowledge-base.md, architecture.md (this file)
```

**`plugin.json`** (minimum viable):
```json
{
  "name": "site-builder",
  "displayName": "Site Builder",
  "version": "0.1.0",
  "description": "Build high-end, tested Next.js websites with taste and validation built in.",
  "keywords": ["web", "design", "accessibility", "nextjs", "quality-gates"]
}
```

---

## 3. The workflow spine (commands)

Seven ordered commands mirror the five lifecycle phases. Each is a thin orchestrator: it sets
the goal, pulls in the relevant skills (which auto-activate), writes/updates an artifact under
`.site/`, and (for verify/review) dispatches gate/reviewer subagents. Failures loop back.

| Command | Phase | Produces (`.site/…`) | Pulls skills / agents |
|---|---|---|---|
| `/site-builder:brief` | Discover | `brief.md` | consumes research as input; structures goals, audience, brand, constraints |
| `/site-builder:plan` | Define | `ia.md`, `content.md`, `acceptance/*.feature` | information-architecture, content-design, ux-writing, acceptance-criteria |
| `/site-builder:tokens` | Design | `tokens.json` (DTCG), `theme.css` | visual-taste, design-tokens |
| `/site-builder:build` | Build | Next.js source in `app/…`, components | component-craft, responsive-layout, interaction-motion |
| `/site-builder:verify` | Verify | `reports/*.json`, `reports/summary.md` | dispatches all `*-gate` subagents |
| `/site-builder:review` | Verify | `review/*.md` | taste-reviewer, a11y-manual-reviewer, content-reviewer + ethical-design |
| `/site-builder:ship` | Operate | `done.md`, PR/deploy | checks Definition of Done, hands off |

The loop: `verify` or `review` failures write findings and route control back to `build`.
`ship` cannot succeed while the Stop hook sees red — see §7.

---

## 4. Domain → primitive mapping (all 21)

The scope pass (generate / consume / validate) folded into the architecture:

| # | Domain | Disposition | Primitive |
|---|---|---|---|
| 1 | Process & Method | **Spine** | the 7 commands + CLAUDE.md |
| 2 | UX Research | **Consume** (brief input) | `brief.md` structure; not generated |
| 3 | Information Architecture | **Generate** | `information-architecture` skill |
| 4 | Content Strategy & Modeling | **Generate** | `content-design` skill |
| 5 | Requirements & Acceptance | **Generate + Validate** | `acceptance-criteria` skill → `acceptance-gate` |
| 6 | Visual & Brand Design | **Generate + Validate** | `visual-taste` + `design-tokens` skills → `a11y-gate` (contrast), `visual-regression-gate` |
| 7 | Interaction, Motion & Patterns | **Generate + Validate** | `interaction-motion` + `component-craft` → `a11y-gate` (reduced-motion, APG) |
| 8 | Content Design & UX Writing | **Generate + Validate** | `ux-writing` skill → `content-reviewer` (readability) |
| 9 | Web Platform & Frontend Eng | **Generate + Validate** | `component-craft` skill → `semantics-gate`, lint |
| 10 | Design-System Engineering | **Generate + Validate** | `component-craft` (atomic) → `tokens-gate`, `visual-regression-gate` |
| 11 | Rendering / Delivery / Infra | **Doctrine + Validate** | Next.js conventions in CLAUDE.md → `performance-gate` |
| 12 | Accessibility | **Validate** | `a11y-gate` + `a11y-manual-reviewer` |
| 13 | Performance | **Validate** | `performance-gate` (Lighthouse CI) |
| 14 | Security | **Validate** | `security-gate` (headers, deps) |
| 15 | Testing & Acceptance | **Validate** | `acceptance-gate` (Playwright+Cucumber) |
| 16 | SEO & Discoverability | **Validate** | `seo-gate` (metadata, JSON-LD) |
| 17 | Analytics / Experiment / Observability | **Consume** (optional config) | scaffolded, off by default |
| 18 | Internationalization & Localization | **Generate-optional + Validate** | conventions → `i18n` check (only if multilingual) |
| 19 | Privacy, Ethics & Law | **Judgment** | `ethical-design` skill + `review` step |
| 20 | Sustainability | **Validate** | `sustainability-gate` (CO2.js budget) |
| 21 | Design Ops & Governance | **Doctrine** | versioning of the plugin + token governance |

**Consumed, not built** (the boundary): UX research, experimentation design, and deep analytics
are treated as *briefs the human/agent provides*, not things the builder authors. Everything in
Phases II–IV is generated and/or validated.

---

## 5. Skills inventory (the `[JUDGMENT]` layers)

Each `SKILL.md` = a `description` that triggers auto-activation + a codified checklist drawn from
the named canon. These carry taste and craft; they do not run tools.

| Skill | Auto-activates when… | Backed by | Ships (key checklist items) |
|---|---|---|---|
| `visual-taste` | any visual/layout/design decision | Refactoring UI, NN/g 5 Principles, Gestalt | spacing/type/color scale discipline, hierarchy, "start with too much whitespace," de-emphasize don't emphasize |
| `design-tokens` | defining color/type/space/theme | W3C DTCG format | primitive→semantic→component tiers, role-based names, light/dark, contrast-safe pairs |
| `information-architecture` | sitemap/nav/labels | polar-bear book | organization schemes, label consistency, nav systems, findability |
| `content-design` | page content/structure | GOV.UK content design | needs-first, front-loaded, scannable, one idea per block |
| `ux-writing` | any UI copy | Strategic Writing for UX, Microcopy | voice/tone, button/error/empty-state copy, plain language |
| `interaction-motion` | animation/transitions/states | Disney 12, Material motion, Saffer | easing/duration tokens, choreography, `prefers-reduced-motion`, microinteraction structure |
| `component-craft` | building React components | React Aria/Radix, Atomic Design, WHATWG | headless a11y primitives, RSC-vs-client, semantic HTML, composition |
| `responsive-layout` | layout/breakpoints | Every Layout, CSS Grid/Flexbox | intrinsic layout primitives, container queries, fluid type |
| `acceptance-criteria` | defining "what done means" | Specification by Example | Given-When-Then per user goal, testable, feature files |
| `ethical-design` | forms/consent/persuasion/pricing | Brignull deceptive.design, GDPR | dark-pattern blocklist, honest defaults, consent, privacy-by-design |

---

## 6. Subagent inventory (the `[GATE]` runners + reviewers)

Each is an `agents/<name>.md` with a tight tool allowlist. Gates run a script and return a
structured `{pass|fail, findings[]}`; results are written to `.site/reports/`. Reviewers apply a
judgment checklist in isolated context (an independent eye) and write to `.site/review/`.

### Gate runners (machine-verifiable)

| Subagent | Runs (against `next build && next start`) | Standard | Fail condition |
|---|---|---|---|
| `a11y-gate` | Playwright + `@axe-core/playwright` (WCAG 2.2 AA tags) | WCAG 2.2 / ARIA | any serious/critical violation |
| `performance-gate` | `@lhci/cli` (Lighthouse CI) | Core Web Vitals | LCP>2.5s / INP>200ms / CLS>0.1 / perf<90 |
| `semantics-gate` | `html-validate` on rendered HTML | HTML Living Std | invalid markup / missing landmarks |
| `security-gate` | header check script + `npm audit` | OWASP Secure Headers | missing CSP/HSTS; high-sev deps |
| `seo-gate` | metadata + JSON-LD presence + Lighthouse SEO | Google Search Essentials / Schema.org | missing title/meta/OG/structured data |
| `visual-regression-gate` | Playwright `toHaveScreenshot` | design-system consistency | unexpected pixel diff |
| `tokens-gate` | Style Dictionary build + stylelint no-hardcoded-color | W3C DTCG | raw hex in components / invalid tokens |
| `acceptance-gate` | Playwright + Cucumber over `.feature` files | Specification by Example | any scenario fails |
| `sustainability-gate` | CO2.js on transfer size | W3C WSG / SWDM v4 | page weight over carbon budget |

### Judgment reviewers (isolated eye)

| Subagent | Checklist from | Catches |
|---|---|---|
| `taste-reviewer` | Refactoring UI + NN/g 5 | hierarchy, spacing rhythm, alignment, "does it look designed" |
| `a11y-manual-reviewer` | WCAG + COGA | keyboard traversal, focus order, SR labels — the ~60% axe misses |
| `content-reviewer` | GOV.UK + plain language | clarity, scannability, reading level, voice consistency |

---

## 7. Hooks — Definition of Done as enforcement

`hooks/hooks.json` carries the spine's teeth:

- **`Stop` hook → the DoD gate.** On every attempt to finish, a script reads
  `.site/reports/summary.md` + `.site/review/`. If any gate is red, any reviewer flagged a
  blocker, or an acceptance feature is unrun/failing, it **blocks** (exit code 2 / `{"decision":"block"}`)
  with the specific failures as the reason, forcing Claude to continue and fix.
- **`PostToolUse` (Write|Edit on source) → auto-format + lint.** Runs Prettier/ESLint/stylelint so
  the tree stays clean without prompting.
- **`SessionStart` → context.** Surfaces current `.site/` phase state so a resumed session knows
  where it is.

This is the mechanism that makes "tested against acceptance criteria" real rather than aspirational:
the model literally cannot declare done while the reports are red.

---

## 8. Standing doctrine — the doctrine skill (NOT plugin CLAUDE.md)

> **Audit correction (C1):** a plugin-root `CLAUDE.md` is **not loaded** into sessions. Doctrine
> must ship as a skill and/or a SessionStart hook, never a plugin CLAUDE.md.

- **`skills/site-builder/SKILL.md`** (auto-activating) carries the runtime doctrine: the taste
  kernel, the Next.js/shadcn conventions (§9), the Definition of Done, and the compose-with-superpowers
  stance.
- **SessionStart hook** (`scripts/phase-status.mjs`) reinforces the DoD via `additionalContext` when
  a `.site/` build is active.
- **`output-styles/site-craft.md`** (`force-for-plugin: true`): evidence-first, never claims "done"
  without the report.
- The plugin-root `CLAUDE.md` is repository dev-notes only; it does not load at runtime.

---

## 9. Next.js output-stack conventions (what generated sites look like)

The concretions that make gates green *by default* rather than by remediation:

- **App Router + React Server Components** by default; Client Components only where interaction
  demands (`"use client"` at the leaf, not the root) → smaller JS → passes INP/perf.
- **Styling (DECIDED):** **Tailwind CSS v4** with `@theme` fed from `tokens.json` via **Style
  Dictionary** → CSS custom properties. Components reference tokens only (enforced by `tokens-gate`).
- **Accessible components (DECIDED):** **shadcn/ui** (`npx shadcn add`) — Radix behavior + Tailwind
  styling + source you own → APG-correct keyboard/roles/focus for free → fewer `a11y-gate` failures.
  shadcn *is* the de facto realization of the Radix + Tailwind v4 choice; theming uses its CSS
  variables + `@theme` (a bespoke DTCG/Style Dictionary pipeline is an optional export, not primary).
- **Images/fonts:** `next/image` (AVIF/WebP, sized) + `next/font` (self-hosted, `display: swap`) →
  passes LCP/CLS + font-loading audits.
- **Motion:** CSS transitions first; Framer Motion where needed, always gated by
  `useReducedMotion()`/`prefers-reduced-motion`.
- **SEO:** Next **Metadata API** for title/OG + a JSON-LD `<script type="application/ld+json">`
  per page type → passes `seo-gate`.
- **Testing baked in:** Playwright (e2e + visual + axe), Vitest (unit), Cucumber (acceptance),
  Lighthouse CI (perf/SEO/best-practices), all runnable locally by the gate subagents and in a
  GitHub Actions workflow the template ships with.

---

## 10. Working artifacts & state flow

Each site project carries a `.site/` working directory — the durable state between phases and the
source of truth the Stop hook reads:

```
.site/
├── brief.md                 # goals, audience, brand, constraints (Phase 0)
├── ia.md                    # sitemap, nav, content model (Phase 1)
├── content.md               # copy + voice/tone (Phase 1)
├── acceptance/*.feature     # Gherkin acceptance criteria (Phase 1)
├── tokens.json              # DTCG design tokens (Phase 2)
├── reports/                 # gate outputs + summary.md (Phase 4)
├── review/                  # filled judgment checklists (Phase 5)
└── done.md                  # Definition-of-Done state (Phase 6)
```

Flow: `brief → {ia, content, acceptance} → tokens → source → reports → review → done`, looping on
any red until the DoD gate is satisfied.

---

## 11. The pilot slice (marketing landing page)

The first thing to build after this blueprint is approved — a thin vertical that exercises **every
primitive once** so we learn how they compose before scaling to all 21 domains:

- **Spine:** `brief → plan → tokens → build → verify → review → ship` (all 7 commands, minimal).
- **Skills exercised:** `visual-taste`, `design-tokens`, `content-design`, `ux-writing`,
  `component-craft`, `responsive-layout`, `interaction-motion`.
- **Gates exercised (start with 4):** `a11y-gate`, `performance-gate`, `semantics-gate`,
  `visual-regression-gate`. (`seo-gate`, `tokens-gate`, `acceptance-gate` added next.)
- **Reviewers:** `taste-reviewer`, `a11y-manual-reviewer`.
- **Output:** one high-craft, responsive, fast, accessible Next.js landing page (hero, sections,
  CTA) whose `.site/reports/summary.md` is fully green and whose DoD Stop hook passes.

Success = the skeleton holds end-to-end and the Stop hook genuinely blocks on an injected failure.

---

## 12. Build order (roadmap)

1. **Skeleton** — `plugin.json`, `CLAUDE.md` (taste kernel + DoD), the 7 command stubs, the
   `hooks.json` Stop-gate reading `.site/reports/`.
2. **Scaffold recipe + overlay** — `templates/scaffold-recipe.md` (create-next-app → shadcn init →
   gate toolchain) + `templates/overlay/` (Playwright/axe/LHCI/html-validate configs + CI workflow).
   No bespoke app or token pipeline.
3. **First skills** — `visual-taste`, `design-tokens`, `component-craft` (enough to build a page well).
4. **First gates** — `a11y-gate`, `performance-gate`, `semantics-gate`, `visual-regression-gate`.
5. **Run the pilot** — landing page end-to-end; prove the Stop hook blocks on red.
6. **Expand** — remaining skills, gates, reviewers; then `seo-gate`, `acceptance-gate`, `tokens-gate`,
   `sustainability-gate`; then archetypes beyond landing pages.

---

## 13. Open decisions

**Resolved**
- ✅ **Output stack:** Next.js (App Router).
- ✅ **Components + theming:** shadcn/ui (Radix + Tailwind v4 `@theme`); DTCG/Style Dictionary optional.
- ✅ **Methodology:** compose with superpowers.
- ✅ **Gates:** thin wrappers over de facto CLIs.
- ✅ **First archetype:** marketing landing page.

**Still deferred (not blocking the skeleton)**
- **Acceptance runner:** playwright-bdd vs. CucumberJS + Playwright.
- **Taste layer:** author `visual-taste` from canon vs. build on the Frontend Design plugin (evaluate).
- **How much of Phase I** (research/strategy) to keep as consume-only vs. add a light generative
  skill later.

---

## 14. Revision — the invent-less direction (adopted)

Principle: **invent as little as possible; adopt de facto solutions.** Buy-vs-build ledger:

| Layer | Adopted (de facto) | Remains bespoke |
|---|---|---|
| Scaffold | `create-next-app` | scaffold recipe |
| Components | **shadcn/ui** (Radix + Tailwind) | — |
| Theming/tokens | shadcn CSS vars + Tailwind `@theme` | thin "tasteful values" guidance; DTCG optional |
| Methodology (brief/plan/execute/verify) | **superpowers** | thin web orchestration that calls it |
| Performance gate | Lighthouse CI | `lighthouserc.json` |
| A11y gate | `@axe-core/playwright` | thin spec |
| Visual / e2e / acceptance | Playwright (+ playwright-bdd) | `.feature` files |
| Semantics / sustainability | html-validate / CO2.js | config + budgets |
| Taste knowledge | evaluate Frontend Design plugin + reference canon | thin taste-checklist skill |
| DoD enforcement | *(no de facto)* | the ~60-line Stop hook |
| Distribution | Claude Code plugin marketplace | `marketplace.json` |

**Irreducible bespoke core:** (1) website taste/gate *knowledge* skills, (2) the DoD Stop hook,
(3) thin orchestration wiring de facto tools into the web workflow, (4) gate configs. Everything
else is adopted. This supersedes the bespoke-template and bespoke-token-pipeline parts of §8–§11.

---

*Blueprint + adopted invent-less revision. Skeleton is built (v0.1.0). Next: doctrine skill is in
place; build the first craft skills + gate subagents, then run the landing-page pilot (which
executes the real create-next-app + shadcn scaffold and settles the untested pieces).*
