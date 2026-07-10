# BUILD SPEC — site-builder v2 (self-contained; hand to a fresh superpowers chat)

> Paste this as your opening message in a new Claude Code session that has the **superpowers**
> plugin installed and the **`soilmass/site-builder`** repo checked out. **This document is
> self-contained** — everything you need to build v2 is below. Other files in `docs/` are optional
> deeper background and are **not required**. Do not depend on them.

---

## 0. Your job & how to work

You are rebuilding a Claude Code plugin — **site-builder** — from **v1 (exists in this repo) to v2**,
and **replacing** v1. v1 works for a single landing page but has a load-bearing flaw (§2). v2 makes
it **trustworthy, comprehensive, and multi-page**.

**Use your superpowers. Do not one-shot this:**
1. Skim the existing repo (`skills/`, `agents/`, `commands/`, `hooks/`, `scripts/`, `templates/`) to
   see v1 as-built — but treat **this spec** as the source of truth for what v2 must be.
2. **`/brainstorm`** any genuine ambiguities before committing to an approach.
3. **`/write-plan`** a phased plan from §12's build order; get it reviewed.
4. **`/execute-plan` with TDD**: for each gate/check, write the failing test/assertion first, then
   implement to green. **verification-before-completion**: never claim a phase done without running
   the real tools and showing their output.
5. **Prove risky assumptions against a real scaffold, early.** (v1's pilot caught that
   `create-next-app` now installs Next 16, that shadcn moved to Base UI, and that the shadcn CLI
   changed — all "known from memory" and all wrong. Expect more; discover them by running.)
6. Commit in coherent phases. Do not open a PR unless asked.

---

## 1. What the plugin is

A plugin that builds **high-end, tested Next.js websites** with taste and validation built in — the
"superpowers for websites." It **composes with superpowers** (superpowers owns the generic
brainstorm/plan/execute/review methodology; site-builder owns the *web* layer: taste, gates,
archetypes). Keep this primitive mapping:

- **Skills** (`skills/<name>/SKILL.md`) = auto-invoked judgment/knowledge; they don't run tools.
- **Commands** (`commands/<name>.md`) = explicit workflow steps (the spine).
- **Hooks** (`hooks/hooks.json` + `scripts/`) = deterministic enforcement reading a machine artifact.
- **`userConfig`** (in `plugin.json`) = the configuration surface (never hand-edited code).
- A plugin-root `CLAUDE.md` does **not** load at plugin *runtime*; runtime doctrine lives in
  `skills/site-builder/SKILL.md` + a `SessionStart` hook. (This repo's own `./CLAUDE.md` loads only
  while you develop *in this repo*.)

**The spine** (7 commands, keep + add a media step): `brief → plan → tokens → build → media →
verify → review → ship`. Each writes an artifact under the site project's `.site/` directory
(`brief.md`, `ia.md`, `content.md`, `acceptance/*.feature`, `tokens.json`, `media.json`, `routes.json`,
`config.json`, `reports/`, `review/`, `state.json`, `done.md`).

---

## 2. THE NON-NEGOTIABLE — the whole reason v2 exists

**v1's DoD Stop hook trusts a `summary.md` that the model writes.** So "the model literally cannot
ship red" is false today — a model could write `STATUS: PASS` without running anything.

**v2 inverts the trust model:**
- A **deterministic gate runner** (`npm run gates`, living in the overlay so it runs inside the
  generated site where the deps are) **builds once, serves once**, runs every gate as a child
  process, **parses the gates' real machine output**, and **writes `.site/reports/summary.json` (+ a
  human `summary.md`) itself**, exiting non-zero if any required gate failed.
- The **Stop hook reads `summary.json`** (never model prose) and also checks **staleness** (§4.7).
- **A gate never reports `pass` unless it actually ran and passed.** A required gate that could not
  run (missing tool/config) is `fail`/`error`, **never a silent pass**. Optional-gate skips (per the
  active archetype) are allowed and recorded explicitly.

Every other v2 change serves this inversion. **Build the runner first and prove it before expanding.**

---

## 3. Verified stack truths (re-verify by running, but start from these)

- **`create-next-app@latest`** → **Next 16 / React 19 / Tailwind v4 / TypeScript**. Scaffold:
  `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
  --use-npm --yes`. Because of `--src-dir`, code is under `src/` (`@/*` → `src/*`): components →
  `src/components/`, pages/`not-found.tsx`/`error.tsx` → `src/app/`.
- **shadcn/ui is built on Base UI (`@base-ui/react`)**, successor to Radix — *not* Radix. Init:
  `npx shadcn@latest init -d -y`; add: `npx shadcn@latest add <c> -y`. Theming = shadcn CSS variables
  + Tailwind v4 `@theme` (a DTCG/Style Dictionary export is optional, not primary).
- The current shadcn **`Button` has no `asChild`** → style link-buttons with
  `buttonVariants({ variant, size, className })` on an `<a>`; keep `<Button>` for real actions.
- **`html-validate:recommended` fails on framework-serialized `<head>`** (self-closing `<meta/>`,
  `charSet`, React `_R_` ids). Use `html-validate:standard` with stylistic rules off
  (`void-style`, `attr-case`, `attribute-boolean-style`, `attribute-empty-style`, `valid-id`) and
  structural/a11y rules on (`heading-level`, `no-missing-references`, `element-required-attributes`,
  `no-dup-id`, `wcag/h37`).
- Some sandboxes pin one Chromium build and forbid `playwright install`; point Playwright at the
  pre-installed binary via `use.launchOptions.executablePath` for local runs. Real CI installs
  browsers with `npx playwright install --with-deps`.

---

## 4. Architecture — build all nine

**4.1 Deterministic gate runner.** `templates/overlay/gates/run-gates.mjs` (+ `npm run gates`), with
per-gate modules under `gates/checks/`, `gates/routes.mjs` (route discovery), `gates/config.mjs`
(threshold resolution). Build once, serve once (reuse ONE server for every gate — v1 re-boots per
gate and races on port 3000). Each module returns `{ id, status: "pass"|"fail"|"skip"|"error",
findings:[], evidence }`. Aggregate to `.site/reports/summary.{json,md}`; `summary.md` carries a
machine line `STATUS: PASS|FAIL` plus one line per gate. Exit non-zero on any required-gate failure.

**4.2 Multi-route.** `.site/routes.json` is the source of truth for the page set, produced at `/plan`
from the IA sitemap and **reconciled against Next's actual build output** at verify time. Every
rendered gate iterates the route set, **including `/404`** (request a nonexistent URL → assert 404
status + branded page) **and the error route.** Adopt **Unlighthouse** for all-route
perf/SEO/best-practices crawling; keep `@lhci/cli` only for tightly-asserted budgets on key routes.

**4.3 Archetype presets.** `archetypes/<name>.json` for landing / docs / e-commerce / portfolio /
web-app. Schema:
```json
{ "name": "...", "description": "...",
  "gates": { "required": ["semantics","a11y","responsive","visual","seo","links","tokens"],
             "optional": ["performance","security","bundle","sustainability","acceptance"] },
  "thresholds": { "lighthouse_min_perf": 0.9, "lighthouse_min_a11y": 0.95, "lighthouse_min_seo": 0.9,
                  "lcp_ms": 2500, "cls": 0.1, "inp_ms": 200, "tap_target_px": 24,
                  "visual_diff_ratio": 0.01, "carbon_budget_kb": 500, "coverage_min": 0 },
  "emphasize_skills": ["..."], "required_route_classes": ["home"], "acceptance_seeds": ["..."] }
```
e-commerce makes `security`+`forms`+`ethical-design`+`acceptance`+`privacy-consent` **required**;
docs makes `navigation`/search required; web-app emphasizes `states`+`spa-a11y`+`forms`+
`observability`. The runner reads the active archetype's gate set — it is data, not model judgment.

**4.4 `userConfig`** in `.claude-plugin/plugin.json` (`archetype`, perf/CLS/LCP budgets,
`tap_target_px`, `visual_diff_ratio`, `wcag_level`, `carbon_budget_kb`, `dod_max_blocks`, image-gen
provider). Threaded via `CLAUDE_PLUGIN_OPTION_*` env → written to `.site/config.json` → read by gate
configs. **Apply archetype defaults when a value is unset** (userConfig isn't always prompted on
enable — known Claude Code issue).

**4.5 Media generation pass.** `/site-builder:media` command + `scripts/generate-media.mjs` + a
`media-gen` agent: fill every `placeholder` slot in `.site/media.json` at its exact declared
width/height from the `art` prompt, write under `public/`, set `src`, flip status → **zero CLS**.
Provider-pluggable via userConfig (the plugin is not itself the image generator; Claude is weak at it).

**4.6 Acceptance via `playwright-bdd`** (not cucumber-js — keep Playwright's runner/fixtures/
webServer/tracing): wire `.site/acceptance/*.feature` + step definitions into the Playwright project
as `gate:acceptance`, aggregated by the runner. This makes the DoD's headline claim real.

**4.7 Resumable state + staleness.** `.site/state.json`
`{ schemaVersion, archetype, phase, routes, artifacts:{ name:{ path, hash, inputsHash, producedAt }}}`.
The runner records the hash of `src/` + tokens when gates pass; the Stop hook (and `/verify`) compare
current source hash to the recorded one — **if they differ, the green is stale and gates must
re-run.** Closes v1's "edit after green still passes" hole. `phase-status.mjs` reads state.json.

**4.8 Distribution.** Bump `plugin.json` `version` to **1.0.0** (real semver; MAJOR on
gate-contract/DoD/state-schema changes, tie to `state.json.schemaVersion`). Keep `marketplace.json`'s
own version as catalog-format only (v1 conflates them). Add `CHANGELOG.md`. superpowers stays an
**optional soft dependency** — keep the "if installed" degradation, document the seam, and keep skill
descriptions out of superpowers' general-engineering lane.

**4.9 Invert subagent roles.** The **runner owns all machine gates**; **retire v1's thin gate
subagents** (`a11y-gate`, `performance-gate`, `semantics-gate`, `responsive-gate`,
`visual-regression-gate`) and do **not** create seo/security/tokens/acceptance/sustainability as
*agents* — they are runner gate modules. **Keep subagents only for judgment** (the 3 reviewers +
a new `production-readiness-reviewer`) **and remediation** (a new `fix-advisor` that reads a red
`summary.json` and proposes fixes), plus `media-gen`.

---

## 5. The gate set — build into the runner (tiered; multi-route × cross-browser × dual-theme)

Each is a `gates/checks/*.mjs` module. **`✓` = v1 has it (expand to all-routes/themes/browsers);
`+` = new.**

**Per-commit (fast, blocking):**
`+ tsc --noEmit` · `+ ESLint + Prettier --check` · `+ Stylelint` (no-hardcoded-color +
`stylelint-color-contrast`) · `+ i18n static` (`eslint-plugin-i18next`) · `+ Vitest + @vitest/coverage-v8`
(threshold) · `+ npm audit --audit-level=high` · `+ gitleaks` · `+ size-limit` · `✓ html-validate`
(all routes) · `+ JSON-LD type-check` (`schema-dts`) · `+ internal links + anchors`
(`linkinator --check-fragments`).

**Pre-merge (medium):**
`✓ axe/WCAG 2.2 AA` (`@axe-core/playwright`, **all routes × light+dark**) · `+ keyboard-flow`
(Playwright Tab/Enter/Esc, focus order + visible focus + skip link) · `+ forms` (validation/error/
success) · `+ acceptance` (playwright-bdd) · `✓ visual regression` (`toHaveScreenshot`,
routes×browsers×themes; mask dynamic regions; baselines in a pinned container) · `✓ responsive matrix`
(320/375/768/1280/1920, all routes; no overflow; tap targets ≥ `tap_target_px`).

**Nightly (slow, deployed preview):**
`+ Semgrep/CodeQL SAST` · `+ Google Rich Results` · `+ external links` (`lychee`) · `+ full 3-browser`
(Chromium+Firefox+WebKit) · `+ Unlighthouse all-route crawl` · `✓ LHCI budgets` · `+ security
headers/CSP/SRI` (Mozilla Observatory + CSP Evaluator) · `+ carbon` (`@tgwf/co2`, pin SWDM v4) · `+ OSV`.

**Continuous (production):** `+ Core Web Vitals RUM` (`web-vitals` attribution → CrUX/PSI cross-check).

**Two gates need real assertions, not proxy scores:**
- **`seo`** — per route assert unique `<title>`/`meta description`, self-referencing canonical, OG +
  Twitter tags, valid JSON-LD, single `<h1>`; assert `/robots.txt` and `/sitemap.xml` return 200. (Do
  NOT rely on Lighthouse's SEO score alone.)
- **`security`** — real header assertions (HSTS/`X-Content-Type-Options`/frame-ancestors/
  `Referrer-Policy`/`Permissions-Policy`), `npm audit`, SRI on third-party assets, and a default
  **report-only CSP** (v1 left CSP as a prose TODO). **`dark-mode a11y`** requires a real theme toggle
  in the overlay (`next-themes`) so axe can run under `.dark`.

---

## 6. Production-readiness inventory — what the new skills & gates must cover

The class of things AI builders skip (v1 already handles responsive, media/CLS, states, dark-mode).
Build the rest. `[GATE]` = automatable (wire into the runner); `[JUDGMENT]` = reviewer checklist.

- **SEO/meta/discoverability** — unique title/description, self-canonical, OG+Twitter (1200×630),
  JSON-LD, robots.txt, XML sitemap (canonical 200s), hreflang, single-`h1`. `[GATE]`
- **Icons/PWA/chrome** — full favicon set, apple-touch + maskable icons, web app manifest,
  `theme-color`, correct `<html lang>`/`dir`. `[GATE]`
- **Forms** — client+server validation, accessible errors (`aria-invalid`/`describedby`/`role=alert`,
  focus to first error), `autocomplete` tokens, real `<label>`, correct input types/`inputmode`, spam
  protection (honeypot/Turnstile), explicit success + disable-on-submit. mostly `[GATE]`
- **Security** *(v1's biggest hole)* — no client secrets, **CSP**, SRI, full security-header set,
  cookie flags (Secure/HttpOnly/SameSite), `npm audit`/OSV, input sanitization. `[GATE]`
- **Privacy/consent** — consent-gated banner (Consent Mode v2), honor **Global Privacy Control**,
  privacy policy, data minimization/IP anonymization. `[GATE]`/`[JUDGMENT]`
- **Analytics** — installed + consent-gated (GA4/Plausible), conversion/event schema on primary
  actions. `[GATE]`/`[JUDGMENT]`
- **Observability** — frontend error monitoring + source maps + release tagging (Sentry), RUM,
  uptime monitoring, alert thresholds. `[GATE]`/`[JUDGMENT]`
- **i18n/l10n** — ICU string externalization, locale routing, **RTL via CSS logical properties**,
  locale-aware dates/numbers/currency (`Intl.*`), text-expansion tolerance. `[JUDGMENT]`+RTL `[GATE]`
- **Cross-browser & PE** — Safari/WebKit + Firefox matrix, autoprefix/Baseline, no-JS resilience. `[GATE]`
- **Performance depth** — JS bundle budget (size-limit), CWV gate, third-party-script discipline,
  font-loading (`swap`+preload+`size-adjust`), resource hints, caching headers, image optimization,
  code-splitting, text compression. `[GATE]`
- **Links/redirects/404** — no broken internal/external links, anchor integrity, custom 404 returning
  404 (not soft-200), redirect hygiene (single 301, no chains), `rel="noopener"` on `_blank`. `[GATE]`
- **Navigation** — accessible mobile menu (disclosure/`aria-expanded`/ESC/focus-trap), **skip link**
  (WCAG 2.4.1), breadcrumbs + BreadcrumbList, `aria-current`, site search (Pagefind/Algolia). `[GATE]`+`[JUDGMENT]`
- **SPA focus & route-change** — focus to `<h1>`/`<main>` on client nav, route-change `aria-live` +
  `document.title`, scroll restoration, visible `:focus-visible` (no bare `outline:none`), focus trap
  in modals. mostly `[JUDGMENT]`
- **Feedback/print/legal** — accessible toasts (`role=status`), destructive-action confirm/undo,
  `@media print` styles; Privacy Policy, Terms, **Imprint/Impressum** (EU-mandatory), accessibility
  statement (EAA), cookie policy, contact/NAP. `[JUDGMENT]`

---

## 7. Skills — keep 13, add 11 (each `skills/<name>/SKILL.md`)

**Keep (13):** `site-builder` (doctrine), `visual-taste`, `design-tokens`, `information-architecture`,
`content-design`, `ux-writing`, `interaction-motion`, `component-craft`, `responsive-layout`,
`acceptance-criteria`, `ethical-design`, `media`, `states`. **Add (11):** `seo`, `security`, `forms`,
`navigation`, `internationalization`, `observability`, `privacy-consent`, `legal-pages`, `spa-a11y`,
`print`, `analytics`.

Each skill: frontmatter (`name` + `description` stating WHEN to use it), tight rules, a "Quality bar
(god-tier)" section, and a "Feeds/Enforced by `<gate>`" line. **Update the `site-builder` doctrine
skill's sequence and DoD to v2** (runner-produced summary, both themes, staleness, production-readiness).

### Canonical sources per skill (so you can write skills without external docs)

| Skill | Canon to ground it in |
|---|---|
| visual-taste | Refactoring UI (Wathan/Schoger); NN/g 5 Principles of Visual Design; Gestalt; Apple HIG; Material 3. Adopt Anthropic's `frontend-design` skill mechanics: ground in the subject, hero-as-thesis, spend boldness in one place, avoid generic defaults — but add the correctness kernel (hierarchy/spacing/type/contrast). |
| design-tokens | W3C Design Tokens (DTCG) format; shadcn CSS-var theming; WCAG 2.2 contrast (4.5:1 text, 3:1 large/UI); OKLCH. Structure before color; roles-not-hex. |
| information-architecture | Rosenfeld/Morville/Arango, *Information Architecture: For the Web and Beyond* (the "polar bear book"); card sorting; tree testing. |
| content-design | GOV.UK content design; Sarah Richards, *Content Design*. Needs-first, front-loaded, scannable. |
| ux-writing | Podmajersky, *Strategic Writing for UX*; Yifrah, *Microcopy*. Active voice, outcome-stating buttons, errors as navigation. |
| interaction-motion | Disney's 12 principles (*The Illusion of Life*); Material 3 motion; Saffer, *Microinteractions*; `prefers-reduced-motion`. Motion last, purposeful, easing from tokens. |
| component-craft | Brad Frost, *Atomic Design*; shadcn/ui (Base UI); WHATWG HTML semantics; RSC-first. |
| responsive-layout | Bell & Pickering, *Every Layout*; Marcotte, *Responsive Web Design*; CSS Grid/Flexbox; WCAG 1.4.10 reflow, 2.5.8 target size. |
| acceptance-criteria | Gojko Adzic, *Specification by Example*; Gherkin; playwright-bdd. |
| ethical-design | Brignull, deceptive.design; GDPR; FTC/EDPB dark-pattern guidance. Honest defaults, symmetry, real consent. |
| media | Next `next/image`; CLS/Core Web Vitals; aspect-ratio reservation. Sized generation-ready `ImageSlot`. |
| states | NN/g states; Next `not-found.tsx`/`error.tsx`/`loading.tsx` conventions. Loading/empty/error, 404/500, zero-one-many. |
| seo | Google Search Essentials; Schema.org/JSON-LD (schema-dts); Next Metadata API; Open Graph protocol. |
| security | OWASP Top 10 / ASVS / Secure Headers Project; CSP Level 3; Subresource Integrity; Mozilla Observatory. |
| forms | WHATWG constraint validation; WCAG 3.3 (Input Assistance); WHATWG autofill tokens. |
| navigation | Kalbach, *Designing Web Navigation*; WCAG 2.4.1 (skip link); ARIA APG disclosure/menu; Schema BreadcrumbList; Pagefind. |
| internationalization | W3C Internationalization; Unicode CLDR / ICU MessageFormat; CSS logical properties; hreflang. |
| observability | OpenTelemetry; Sentry (source maps + releases); Google SRE Book; `web-vitals`. |
| privacy-consent | GDPR; ePrivacy/cookie law; Global Privacy Control spec; Google Consent Mode v2. |
| legal-pages | GDPR Art. 12; European Accessibility Act; German TMG §5 (Impressum). |
| spa-a11y | WCAG 2.4.3 (focus order), 2.4.7 (focus visible), 2.4.11 (focus appearance); route-change announcement patterns. |
| print | CSS `@media print`. Hide chrome, expand content, show link URLs, black-on-white. |
| analytics | GA4 / Plausible; tracking-plan governance; consent-gating; semantic event schema. |

---

## 8. Definition of Done v2 (encode as the Stop hook + runner contract)

A site ships only when **all** hold, from machine evidence:
- `summary.json` `status == "pass"`: **every required gate (per the active archetype) ran and passed
  across all routes and both themes**; optional gates pass or are explicitly skipped.
- Every `.site/acceptance/*.feature` scenario passes (via `gate:acceptance`).
- Every `.site/review/*.md` reviewer is `VERDICT: PASS` (taste, manual-a11y, content,
  production-readiness).
- **Production-readiness has real checks** (no honor-system): custom `404` returns 404 + branded page;
  `error.tsx` present; per-page `<title>`/description/canonical/OG/favicon in rendered head; every
  `<img>`/media reconciles to a sized `ImageSlot` in `.site/media.json`; dark mode present + contrast
  safe in both themes; skip link present; `prefers-reduced-motion` honored; robots + sitemap 200.
- **Not stale** (source hash matches the hash recorded when gates passed).
- The **release valve is loud, logged, and requires explicit acknowledgement** — never a silent allow.

---

## 9. Fix these v1 defects (audit findings — most are subsumed by the architecture above)

1. **DoD is a self-report** — hook greps a model-authored `STATUS: PASS`. → §2 runner. *(keystone)*
2. **5 gates referenced but never built** (seo/security/tokens/acceptance/sustainability agents). → runner modules.
3. **Acceptance entirely unwired** — features produced, never run, hook never reads them. → §4.6.
4. **Every gate tests only `/`.** → §4.2 routes.json (incl. /404 + error).
5. **Dark mode required by DoD but never verified**, and no theme toggle shipped. → add `next-themes` + axe both themes.
6. **DoD bullets with no enforcing check** (media sizing, favicon/OG, 404/error, states). → §8 real presence checks.
7. **`media`/`states` unproven** (v1 pilot was one page). → prove in the §11 multi-page pilot.
8. **`verify` orchestration fragile** (10 subagents each rebuild + race on :3000, self-report PASS). → single runner.
9. **Chromium-only**, desktop-only Lighthouse. → +WebKit/Firefox + mobile-throttled Lighthouse.
10. **Visual gate is a no-op on first build + env-fragile** (baseline differs local↔CI). → pinned container, masking, or DOM snapshot.
11. **`architecture.md` stale** (still says "Radix", lists nonexistent scripts). → regenerate to as-built v2.
12. **Overlay paths ignore `--src-dir`** → put components in `src/components/`, pages in `src/app/`.
13. **Security claimed but unenforced**, CSP a TODO, HSTS meaningless on localhost. → real header gate + report-only CSP.
14. **Dead deps** (`@tgwf/co2` installed, no gate; no stylelint for "no raw hex"). → wire or remove.
15. **Lighthouse SEO/perf are proxies** (no real structured-data assertion; desktop-localhost LCP trivial). → §5 real seo gate + mobile throttling.
16. **Release valve can ship red silently** (`dod-gate.mjs` exits 0 after 5 blocks). → loud + logged + acknowledged.
17. **Tap-target guidance inconsistent** (44 vs 24, tested at 375 only). → one floor, tested across matrix + spacing exception.
18. **superpowers soft-dep undeclared** with one-line fallbacks. → document seam; keep optional.
19. **Doctrine-without-check** (reduced-motion, JSON-LD/OG, robots/sitemap, 400% reflow). → add targeted checks.
20. **PostToolUse formatter over-broad** (runs on the plugin's own docs + `.site/`). → scope to app tree, skip `.site/`/markdown.

---

## 10. Remove / rewrite (get rid of the previous iteration)

- Delete `agents/{a11y,performance,semantics,responsive,visual-regression}-gate.md` (runner replaces them).
- Rewrite `commands/verify.md` to **run `npm run gates`** and narrate the machine `summary.md` — no
  gate-subagent dispatch, no model-authored verdict.
- Rewrite `scripts/dod-gate.mjs` to read `summary.json` + check staleness (not grep prose).
- Regenerate `docs/architecture.md` to match as-built v2.
- Scope `scripts/format-if-source.mjs`; fix the tap-target inconsistency.

---

## 11. Acceptance criteria for the BUILD ITSELF (your verification-before-completion gate)

You are done only when you have **demonstrated, with real tool output**, all of:
1. `npm run gates` in a freshly scaffolded site produces `.site/reports/summary.json` deterministically
   (no model authorship) and **exits non-zero when a gate fails** (prove with an injected failure).
2. The DoD Stop hook **blocks on a real red gate**, **blocks on staleness** (edit a source file after a
   green run → hook blocks), and allows only on genuine green.
3. A **new multi-page pilot** — ≥3 content routes + a custom `/404` + an `error.tsx` + ≥1 `ImageSlot` +
   a working light/dark toggle + one accessible form — **passes every required gate for its archetype
   across all routes and both themes**, shown end-to-end.
4. Cross-browser gates run on Chromium + Firefox + WebKit (or the limitation is stated honestly in the
   report, not hidden).
5. Every DoD bullet in §8 maps to an actual executed check (grep the runner; zero honor-system items).
6. Structure complete: **24 skills**; **5 archetype profiles** (valid JSON); the runner + all wired
   gate modules; `plugin.json` at **1.0.0** with `userConfig`; `CHANGELOG.md`; `architecture.md`
   matches as-built; v1 gate agents removed.

Treat the multi-page pilot the way v1 treated its landing-page pilot: it is the proof, and it *will*
surface wrong assumptions — fix them and fold the corrections back into the skills/recipe/docs.

---

## 12. Build order (turn this into your plan; keystone first)

1. **Gate runner + `summary.json` + repoint the DoD hook** (§2/§4.1/§4.9) — the whole point; first.
2. **`routes.json` + route-parametric gates + Unlighthouse** (§4.2).
3. **`userConfig` → `.site/config.json` + `archetypes/*.json`** (§4.3/§4.4).
4. **`playwright-bdd` `gate:acceptance`** (§4.6).
5. **Security + SEO + links/404 + tokens(stylelint) + bundle(size-limit)** gates & skills (§5/§6/§7).
6. **Cross-browser + dark-mode a11y** (add `next-themes`; expand Playwright gates).
7. **`.site/state.json` + input-hash staleness** (§4.7).
8. **`/site-builder:media` generation pass** (§4.5).
9. **Remaining skills** (forms, i18n, navigation, spa-a11y, observability, privacy-consent, legal,
   print, analytics) + the `production-readiness-reviewer` + `fix-advisor` agents.
10. **Multi-page pilot** proving §11, on a `docs` or `e-commerce` archetype.
11. **1.0.0 / CHANGELOG / architecture.md rewrite / composition docs** (§4.8/§10).

**Prove the keystone (steps 1–2) against a minimal multi-page scaffold before building the long tail.
Do not expand breadth until the runner + DoD inversion are demonstrably real.**

---

*The whole objective in one line: **make the Definition of Done real by having deterministic gates —
not the model — decide it, across every route and both themes.***
