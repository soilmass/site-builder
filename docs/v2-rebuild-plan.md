# site-builder v2 — Comprehensive Rebuild Plan

> A build-from-this plan for a fuller, more trustworthy v2. Synthesized from a four-angle gap sweep:
> production-readiness gaps, the complete quality-gate surface, v2 architecture, and a critical audit
> of v1 as-built. v1 proved the *shape* works end-to-end (the Ember pilot passed 5 gates + the DoD
> hook). v2 makes it **trustworthy, comprehensive, and multi-page**.

---

## 0. The load-bearing weakness (fix this first)

**v1's DoD hook is only as honest as a file the model writes.** `scripts/dod-gate.mjs` greps
`.site/reports/summary.md` for `STATUS: PASS`, but `commands/verify.md` has *the model* author that
file after dispatching gate subagents. Nothing guarantees the gates actually ran, ran against the
whole site, or were reported honestly. **The enforcement spine rests on model narration — the exact
thing the spine exists to distrust.**

**v2 fix (everything else depends on this):** a deterministic **gate runner** (`scripts/run-gates.mjs`,
`npm run gates`) builds the site once, boots one server, runs every gate as a child process, and
**writes `summary.md` + `summary.json` itself** with a real exit code. The DoD hook keys off that
machine-produced artifact. `/verify` becomes a thin narrator, no longer the author of the verdict.

Secondary audit finding: **5 gates are referenced but don't exist** — `acceptance-gate`, `seo-gate`,
`security-gate`, `tokens-gate`, `sustainability-gate` appear in `docs/architecture.md` §6 and
`verify.md` but have no agent and no runner. v2 builds them into the runner's gate table.

---

## 1. What v1 has vs. what v2 needs (audit summary)

| v1 state | v2 target |
|---|---|
| Summary authored by the model | Summary is a deterministic build artifact (runner) |
| Gates test **`/` only** | Every gate iterates a **route manifest** (`.site/routes.json`) |
| **Chromium only** | Cross-browser: + Firefox + WebKit (Playwright projects) |
| a11y run in light theme only | a11y + contrast run in **both light and dark** |
| 5 gates wired; 5 referenced-but-missing | ~26-gate surface, all real, in the runner |
| `media` / `states` skills unproven | Pilot-proven (ImageSlot zero-CLS swap; 404/error) |
| Acceptance `.feature` files produced, never run | **playwright-bdd** runs them (the DoD's headline claim) |
| Thresholds hard-coded in test files | `userConfig` in `plugin.json` → `.site/config.json` |
| No archetype definitions ("vibes") | `archetypes/*.json` profiles (gate set + budgets + skills) |
| No staleness detection (edit-after-green passes) | Input-hash staleness in `.site/state.json` |
| `media.json` manifest, no generator | `/site-builder:media` second-pass image generation |

---

## 2. The production-readiness gap inventory (beyond responsive/media/states/dark-mode)

The class the current work started on. Each becomes a skill and/or gate in v2. `[GATE]` = automatable.

### SEO, meta & discoverability
Unique per-page title/description `[GATE]` · self-referencing canonical `[GATE]` · Open Graph +
Twitter Card (+1200×630 image) `[GATE]` · JSON-LD structured data `[GATE]` · `robots.txt` `[GATE]` ·
stray-`noindex` hygiene `[GATE]` · auto XML sitemap (canonical 200s only) `[GATE]` · hreflang (i18n)
`[GATE]` · single-`h1` heading outline `[GATE]`.

### Icons, PWA & browser chrome
Full favicon set `[GATE]` · apple-touch + maskable icons `[GATE]` · web app manifest `[GATE]` ·
`theme-color` (light/dark) `[GATE]` · correct `<html lang>`/`dir` `[GATE]`.

### Forms
Client + server validation `[JUDGMENT]` · accessible errors (`aria-invalid`/`describedby`/`role=alert`,
focus to first error) `[GATE]` · `autocomplete` tokens `[GATE]` · programmatic `<label>` `[GATE]` ·
spam protection (honeypot/Turnstile) `[JUDGMENT]` · explicit success + disable-on-submit `[JUDGMENT]` ·
correct input types / `inputmode` `[GATE]`.

### Security *(v1's single biggest hole — no CSP/header layer)*
No client-side secrets `[GATE]` (gitleaks) · **Content-Security-Policy** `[GATE]` (CSP Evaluator) ·
SRI on third-party assets `[GATE]` · full security-header set (HSTS/`nosniff`/frame-ancestors/
Referrer-Policy/Permissions-Policy) `[GATE]` (Observatory) · HTTPS+HSTS `[GATE]` · input sanitization
`[JUDGMENT]` (Semgrep/CodeQL) · dependency audit `[GATE]` (npm audit/osv-scanner) · rate limiting
`[JUDGMENT]` · CSRF `[JUDGMENT]` · cookie flags (Secure/HttpOnly/SameSite) `[GATE]`.

### Privacy & consent
Consent-gated cookie banner (Consent Mode v2) `[JUDGMENT]` · honor **Global Privacy Control** `[GATE]`
(legally required in 12+ US states 2026) · privacy policy page `[GATE]` · data minimization/IP
anonymization `[JUDGMENT]`.

### Analytics & observability
Analytics installed + consent-gated `[GATE]` · conversion/event tracking `[JUDGMENT]` · **frontend
error monitoring** with source maps (Sentry) `[GATE]` · RUM `[JUDGMENT]` · uptime monitoring `[GATE]`
· alert thresholds `[JUDGMENT]`.

### Internationalization
String externalization (ICU) `[JUDGMENT]` · locale routing `[JUDGMENT]` · **RTL via logical
properties** `[GATE]` (grep physical margins) · locale-aware dates/numbers/currency `[JUDGMENT]` ·
text-expansion tolerance `[JUDGMENT]`.

### Cross-browser & progressive enhancement
Safari/iOS + Firefox matrix `[GATE]` (Playwright projects) · autoprefix/Baseline `[GATE]` · no-JS
resilience `[JUDGMENT]`.

### Performance depth
JS bundle budget `[GATE]` (size-limit) · CWV gate `[GATE]` · third-party script discipline `[GATE]` ·
font-loading (`swap`+preload+`size-adjust`) `[GATE]` · resource hints `[GATE]` · caching headers
`[GATE]` · image optimization/AVIF `[GATE]` · code-splitting/lazy `[JUDGMENT]` · text compression `[GATE]`.

### Links, redirects & 404
No broken internal/external links `[GATE]` (linkinator/lychee) · in-page anchor integrity `[GATE]` ·
custom 404 returning 404 (not soft-200) `[GATE]` · redirect hygiene (single 301, no chains) `[GATE]` ·
`rel="noopener"` on `target=_blank` `[GATE]`.

### Navigation & wayfinding
Working accessible mobile menu `[JUDGMENT]` · **skip link** (WCAG 2.4.1) `[GATE]` · breadcrumbs +
BreadcrumbList `[JUDGMENT]` · site search (content-heavy) `[JUDGMENT]` · `aria-current` active state `[GATE]`.

### SPA focus & route-change *(v1's other systemic hole)*
Focus to `<h1>`/`<main>` on client nav `[JUDGMENT]` · route-change `aria-live` announcement +
`document.title` `[JUDGMENT]` · scroll restoration `[JUDGMENT]` · visible `:focus-visible` (no bare
`outline:none`) `[GATE]` · focus trap in modals/menus `[JUDGMENT]`.

### Feedback, print, legal
Accessible toasts (`role=status`) `[JUDGMENT]` · destructive-action confirm/undo `[JUDGMENT]` ·
`@media print` styles `[JUDGMENT]` · Terms `[JUDGMENT]` · Imprint/Impressum (EU-mandatory) `[JUDGMENT]`
· accessibility statement (EAA) `[JUDGMENT]` · cookie policy `[JUDGMENT]` · contact/NAP `[JUDGMENT]`.

---

## 3. The complete gate surface (~26 gates, tiered by speed)

Route discovery is the backbone: every "per route" gate reads `.site/routes.json`. **EXISTING** = in
v1 (but `/`-only, expand to all routes/browsers/themes).

**Per-commit (fast, blocking, <~3 min):**
`tsc --noEmit` · ESLint + Prettier · Stylelint (no hardcoded color + contrast) · i18n static
(`eslint-plugin-i18next`) · Vitest + coverage · `npm audit` · gitleaks · size-limit · html-validate
*(EXISTING, all routes)* · JSON-LD type-check (`schema-dts`) · internal link + anchor check
(`linkinator --check-fragments`).

**Pre-merge (medium, Chromium + one secondary engine):**
axe/WCAG 2.2 AA *(EXISTING, all routes + both themes)* · keyboard-flow · forms · **acceptance
(playwright-bdd)** · visual regression *(EXISTING, routes×browsers×themes)* · responsive matrix
*(EXISTING, all routes)*.

**Nightly (slow, against a deployed preview URL):**
Semgrep/CodeQL SAST · Google Rich Results API · external links (lychee) · full 3-browser
(Firefox+WebKit) · **Unlighthouse all-route perf/SEO/BP crawl** *(the single biggest missing gate)* ·
LHCI budget assertions *(EXISTING, expand)* · security headers/CSP/SRI (Observatory + CSP Evaluator) ·
carbon (CO2.js, pin SWDM v4) · OSV full scan.

**Continuous (production):**
Core Web Vitals RUM (`web-vitals` attribution → CrUX/PSI cross-check) — lab gates can't see INP,
which is field-only and the most-failed vital.

---

## 4. v2 architecture (the nine decisions)

1. **Unified gate runner** (`scripts/run-gates.mjs`): one build, one server, deterministic
   `summary.{md,json}`, one exit code. Repoint `dod-gate.mjs` at it. *Fixes §0.*
2. **Multi-route** via `.site/routes.json` (produced at `/plan` from the IA sitemap, reconciled
   against Next's build output). Playwright gates loop routes; adopt **Unlighthouse** for all-route
   perf. Adding a page widens coverage with zero code change.
3. **Archetype presets** `archetypes/<name>.json` (landing/docs/e-commerce/portfolio/web-app): each
   declares its gate set, threshold overrides, emphasized skills, required route classes, and
   acceptance seeds. Turns "*if in the archetype's set*" from model-interpreted prose into enforced data.
4. **`userConfig`** in `plugin.json` (archetype, perf/CLS/LCP budgets, tap-target px, visual-diff
   ratio, WCAG level, carbon budget, `dod_max_blocks`). Threaded via `CLAUDE_PLUGIN_OPTION_*` →
   `.site/config.json` → gate configs. Stops users editing plugin-owned code. *(Apply archetype
   defaults when unset — known issue #39455: userConfig isn't always prompted.)*
5. **Media generation pass** `/site-builder:media` + `scripts/generate-media.mjs`: fill every
   `placeholder` slot in `.site/media.json` at its exact declared size → set `src`, flip status →
   zero CLS, no layout code touched. Provider-pluggable (Claude isn't the image model).
6. **Acceptance via playwright-bdd** (not cucumber-js): reuses Playwright's runner/fixtures/
   `webServer`/tracing; one runner, one report. Registers as `gate:acceptance`. Makes the DoD's
   headline requirement real.
7. **Resumable/idempotent state** `.site/state.json` (`{schemaVersion, archetype, phase, routes,
   artifacts:{name:{path,hash,inputsHash,producedAt}}}`). **Input-hash staleness** closes the
   "edit after green → stale pass" hole: the hook re-checks source hash vs. the hash recorded when
   gates passed. Phases become safe to re-run.
8. **Distribution**: treat `plugin.json` `version` as real semver (MAJOR on gate-contract/DoD/state
   schema changes); keep `marketplace.json` version as catalog-format only (v1 conflates them); add
   `CHANGELOG.md`. Superpowers stays an **optional soft dependency** (the "if installed" degradation
   is correct); document the seam (superpowers = generic methodology, site-builder = web layer).
9. **Invert subagent roles**: the **runner** owns all machine-verifiable gates (retire the thin
   pass/fail gate subagents — a subagent that forwards an exit code adds latency + a fabrication
   surface). **Keep subagents only for judgment** (the 3 reviewers) **and remediation** (a diagnostic
   agent that reads a red `summary.json` and proposes fixes).

---

## 5. New skills v2 needs (added to v1's 13)

`seo` · `security` (CSP/headers/SRI/secrets) · `forms` · `internationalization` · `analytics` ·
`observability` · `navigation` (mobile-menu/skip-link/breadcrumbs/search/active-state) ·
`privacy-consent` · `legal-pages` · `spa-a11y` (focus + route-change) · `print`. Each thin,
canon-grounded, wired to its gate — same pattern as the existing skills.

---

## 6. Alignment with Claude Code plugin best practices (2026)

The v1 primitive mapping is correct and should be preserved: **skills = auto-invoked judgment/context**,
**commands = explicit workflow steps**, **hooks = deterministic enforcement reading a machine artifact**,
**`userConfig` = the sanctioned config surface** (not hand-edited code). v2 leans *harder* into this:
enforcement in the runner + hook (deterministic), craft in skills (judgment), spine in commands.

---

## 7. Prioritized build order (v2 roadmap)

1. **Gate runner** + repoint DoD hook (§0/§4.1/§4.9) — highest leverage; fixes the trust gap.
2. **`routes.json` + route-parametric gates + Unlighthouse** (§4.2) — real multi-page coverage.
3. **`userConfig` → `.site/config.json` threading** (§4.4) — de-hardcode thresholds.
4. **`archetypes/*.json`** consumed by the runner (§4.3).
5. **playwright-bdd `gate:acceptance`** (§4.6) — makes the DoD headline enforceable.
6. **Security cluster** (CSP/headers/SRI/audit/secrets) + **SEO cluster** (meta/canonical/OG/JSON-LD/
   sitemap/robots) + **links/404** gates + skills (§2) — the biggest correctness/coverage wins.
7. **Cross-browser + dark-mode a11y** (expand existing Playwright gates).
8. **`.site/state.json` + input-hash staleness** (§4.7).
9. **`/site-builder:media` generation pass** (§4.5).
10. **Forms / i18n / navigation / SPA-a11y / observability / privacy / legal** skills + gates (§2/§5).
11. **Pilot v2 on a multi-page archetype** (docs or e-commerce) — prove routes, archetypes, acceptance,
    media-gen, and cross-browser end-to-end, the way v1's pilot proved the single-page path.
12. **Semver / changelog / composition docs** (§4.8).

---

## 8. Migration notes (v1 → v2)

- v1's skills, DoD hook mechanics, sequencing, scaffold-recipe, and overlay configs **carry forward**.
- The breaking change is the **runner owning `summary.md`** — update `verify.md` to call `npm run
  gates` and narrate, not author. Bump plugin MAJOR and set `state.json.schemaVersion`.
- Keep the Ember (landing) pilot as the v2 regression baseline; add a multi-page pilot alongside it.

---

## Appendix A — v1 critical audit (ranked, file-referenced)

The dedicated audit of v1-as-built. Ranked most severe first; each is a concrete v2 fix target.

1. **DoD is a self-report, not a machine check** — `dod-gate.mjs:92-105` regex-matches a `STATUS: PASS`
   line that `verify.md:22-26` tells the *model* to write; no script parses raw gate JSON. → §0 runner.
2. **5 of 10 gates don't exist** — `security/seo/tokens/acceptance/sustainability-gate` are dispatched
   by `verify.md` + documented in `architecture.md` but have no `agents/*.md`. → build in runner or delete.
3. **Acceptance (the #1 DoD item) is entirely unwired** — no playwright-bdd installed, no `gate:acceptance`,
   `dod-gate.mjs` never reads `.site/acceptance/`. The plugin's raison d'être is unexecuted. → §4.6.
4. **Every gate tests only `/`** — all overlay specs + `lighthouserc.json` hardcode `/`; non-home routes,
   404, and error pages are unverified. → §4.2 routes.json.
5. **Dark mode required by DoD but never verified — and maybe unbuildable** — `a11y.spec.ts` loads light
   only; no `next-themes`/toggle in the overlay. Skills falsely claim "the a11y gate checks dark contrast." → ship toggle + axe both themes.
6. **DoD bullets with zero enforcing check** — media sizing, favicon/OG, 404/error presence, states: none
   map to a gate; `states` claims "enforced by review" but no states reviewer exists. → add presence checks.
7. **`media` + `states` unproven** — the Ember pilot was a single page with no images/states/forms/dark. → multi-page pilot.
8. **`verify` orchestration fragile** — 10 subagents each rebuild + boot :3000 (port contention), each self-reports PASS. → single runner.
9. **Chromium-only** — one Playwright project; CI installs only chromium; desktop-only Lighthouse. → +WebKit/Firefox + mobile LH.
10. **Visual gate is a no-op on first build + env-fragile** — first run "PASS by definition"; pixel baselines differ local↔CI (pinned 1194 vs CI build). → pinned container, masking, or DOM snapshot.
11. **`architecture.md` is stale** — still says "Radix" (`:244,246,319,339`); the token pipeline still marked "Style Dictionary (DECIDED)" contradicting the shadcn-primary stance; lists scripts (`run-a11y.mjs` etc.) that don't exist. → regenerate from as-built. *(fixed in this commit)*
12. **Overlay paths break under `--src-dir`** — recipe scaffolds with `--src-dir` but copies `components/image-slot.tsx` to root; `@/*`→`src/*` so the import breaks; `app/` paths should be `src/app/`. → src-dir-aware copy. *(fixed in this commit)*
13. **Security claimed but wholly unenforced** — no header script, no `npm audit` wiring; the one artifact (`next.config.headers.md`) omits CSP and sets HSTS (meaningless on localhost). → header-assert script + default report-only CSP.
14. **Dead deps** — `@tgwf/co2` installed but no sustainability gate; no stylelint for the "no raw hex" invariant. → wire or remove.
15. **Lighthouse overlaps a11y/SEO + unrealistic target** — LHCI SEO score is the *only* SEO check (proxy, not structured-data assertion); LCP measured on desktop localhost is trivially met. → real metadata assertions + mobile throttled LH.
16. **Release valve lets a red site ship** — `dod-gate.mjs:62-71` exits 0 after 5 blocks; combined with #1, "cannot declare done while red" is overstated. → loud, logged, explicit forced-red acknowledgement.
17. **Tap-target guidance inconsistent** — 44px (`responsive-layout`) vs 24px (`responsive-gate`/doctrine/test); tested at 375 only, skips 320, ignores the spacing exception. → one floor, tested across matrix.
18. **superpowers soft-dependency undeclared** — core methodology routed to it "if installed" with one-line fallbacks; no manifest dependency. → vendor the methodology or declare it.
19. **More doctrine-without-check** — `prefers-reduced-motion`, JSON-LD/OG presence, robots/sitemap, 400%-zoom reflow are all asserted, none verified. → targeted checks.
20. **PostToolUse formatter over-broad** — `format-if-source.mjs` runs prettier on the plugin's own docs + `.site/` artifacts, serially, silent-no-op if prettier absent. → scope to app tree, skip `.site/`/markdown.

**Cross-cutting theme:** the central promise — *mechanically enforced, evidence-based DoD* — is undermined
because (a) enforcement trusts a model-authored status line (#1), (b) half the gates + all acceptance
don't exist (#2/#3), and (c) the gates that do exist cover one route/browser/theme (#4/#5/#9). v2 inverts
the trust model: a deterministic runner executes real gates over the full route set and both themes, emits
machine-readable results, and the Stop hook reads *those* — never prose.

---

*Sources folded in from the sweep: Unlighthouse (all-route perf), playwright-bdd (acceptance),
size-limit (budgets), CO2.js/SWDM v4 (carbon), CSP Evaluator + Mozilla Observatory (security),
linkinator/lychee (links+anchors), Google Rich Results + schema.org (structured data), Stylelint
token/contrast, eslint-plugin-i18next (i18n), web-vitals + CrUX (RUM), Global Privacy Control,
Claude Code plugins reference (userConfig/marketplace).*
