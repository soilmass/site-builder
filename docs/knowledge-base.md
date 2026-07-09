# The Body of Knowledge for Building High-End Websites

> A located map of the *de facto standards and canonical references* for building
> high-end, tested websites — assembled to be the source-of-truth a Claude-based
> site-builder ("superpowers for websites") encodes as skills and validation gates.
>
> This is a **research/reference artifact**, not an implementation. It locates the
> existing canon; it does not invent methodology.

## How to read this

There is **no single ratified "Website BoK"** the way IEEE SWEBOK exists for software
engineering. Instead the knowledge lives in **three tiers**, and this document maps all
three onto one taxonomy:

1. **Normative standards** — formally ratified, citable, sometimes legally binding
   (W3C/WHATWG specs, WCAG, ISO 9241, EN 301 549, IETF RFCs).
2. **De facto reference BoK** — authored to be converged on (MDN Curriculum,
   web.dev/learn, patterns.dev, the W3C Design Tokens format).
3. **Recognized professional canon** — seminal books and authorities that hold the
   field's judgment layer (NN/g, the polar-bear book, Refactoring UI, Bringhurst,
   Baymard, Brignull).

Every entry is tagged:

- **`[GATE]`** — machine-verifiable with a named tool → becomes a red/green check.
- **`[JUDGMENT]`** — craft/human-review → a codified checklist a subagent applies, not a scanner.

The single most important structural fact: **only ~40% of the territory is a `[GATE]`.**
The rest is judgment. A site-builder's differentiator is codifying the judgment layers
into repeatable checklists — not just wiring up scanners.

---

## The map at a glance (5 phases → 21 domains)

| Phase | Domains |
|---|---|
| **I. Discover & Define** | 1. Process & Method · 2. UX Research · 3. Information Architecture · 4. Content Strategy & Modeling · 5. Requirements & Acceptance |
| **II. Design** | 6. Visual & Brand Design · 7. Interaction, Motion & UI Patterns · 8. Content Design & UX Writing |
| **III. Build** | 9. Web Platform & Frontend Engineering · 10. Design-System Engineering · 11. Rendering, Delivery & Infrastructure |
| **IV. Verify & Operate** | 12. Accessibility · 13. Performance · 14. Security · 15. Testing & Acceptance · 16. SEO & Discoverability · 17. Analytics, Experimentation & Observability |
| **V. Govern (cross-cutting)** | 18. Internationalization & Localization · 19. Privacy, Ethics & Law · 20. Sustainability · 21. Design Ops & Governance |

---

# Phase I — Discover & Define

## 1. Process & Method
- **Human-Centred Design (umbrella)** — ISO 9241-210:2019 `[JUDGMENT]` — the HCD lifecycle & principles.
- **Design Thinking** — Tim Brown *Change by Design* (IDEO); Stanford d.school Bootleg `[JUDGMENT]` — empathize→define→ideate→prototype→test.
- **Double Diamond** — UK Design Council *Framework for Innovation* `[JUDGMENT]` — discover→define→develop→deliver.
- **Problem framing / reframing** — Kees Dorst *Frame Innovation* `[JUDGMENT]`.
- **Service design & blueprinting** — Stickdorn et al. *This Is Service Design Doing*; Shostack (HBR 1984) `[JUDGMENT]`.
- **Lean / hypothesis-driven discovery** — Gothelf & Seiden *Lean UX*; Teresa Torres *Continuous Discovery Habits* `[JUDGMENT]`.
- **Design sprints & alignment** — Knapp *Sprint*; Gray/Brown/Macanufo *Gamestorming* `[JUDGMENT]`.

## 2. UX Research
- **Research strategy & method selection** — Erika Hall *Just Enough Research* `[JUDGMENT]`.
- **Interviews & contextual inquiry** — Portigal *Interviewing Users*; Beyer & Holtzblatt *Contextual Design* `[JUDGMENT]`.
- **Ethnography / diary studies** — Sam Ladner *Practical Ethnography* `[JUDGMENT]`.
- **Survey design** — Dillman *Tailored Design Method* `[JUDGMENT]`.
- **Quantitative UX & standardized instruments (SUS/UMUX/SEQ)** — Sauro & Lewis *Quantifying the User Experience* `[GATE]` MeasuringU/SUPR-Q calculators.
- **Usability testing** — Krug *Rocket Surgery Made Easy*; ISO 9241-11 / ISO 25062 (CIF) `[JUDGMENT]`.
- **Heuristic evaluation** — Nielsen's 10 Usability Heuristics (NN/g) `[JUDGMENT]`.
- **Mental-model research** — Indi Young *Mental Models* `[JUDGMENT]`.
- **Synthesis / affinity diagramming** — KJ method; Beyer & Holtzblatt `[JUDGMENT]`.
- **Success metrics (HEART / Goals-Signals-Metrics)** — Rodden et al. (Google, CHI 2010) `[JUDGMENT]`.

## 3. Information Architecture
- **IA core** — Rosenfeld, Morville & Arango *Information Architecture: For the Web and Beyond* (the "polar bear book") `[JUDGMENT]` — organization, labeling, navigation, search.
- **Sensemaking** — Abby Covert *How to Make Sense of Any Mess* `[JUDGMENT]`.
- **Card sorting** — Donna Spencer *Card Sorting* `[GATE]` OptimalSort.
- **Tree testing** — NN/g; `[GATE]` Treejack.
- **Taxonomy & controlled vocabulary** — ANSI/NISO Z39.19; Hedden *The Accidental Taxonomist* `[JUDGMENT]`.
- **Semantic vocabularies** — ISO 25964; W3C SKOS `[GATE]` SKOS/SHACL validators.

## 4. Content Strategy & Modeling
- **Content strategy** — Halvorson & Rach *Content Strategy for the Web*; Kissane *The Elements of Content Strategy* `[JUDGMENT]`.
- **Content audit & inventory** — NN/g method `[GATE]` Screaming Frog.
- **Content modeling / structured content** — Atherton & Hane *Designing Connected Content*; Wachter-Boettcher *Content Everywhere* `[GATE]` CMS/JSON-schema validation.
- **Message architecture** — Margot Bloomstein *Content Strategy at Work* `[JUDGMENT]`.
- **Headless CMS / composable content** — Contentful/Sanity modeling docs; jamstack.org `[JUDGMENT]`.
- **Content governance & ContentOps** — Rockley & Cooper *Managing Enterprise Content* `[JUDGMENT]`.

## 5. Requirements & Acceptance
- **Requirements engineering** — ISO/IEC/IEEE 29148:2018; Wiegers *Software Requirements* `[JUDGMENT]`.
- **User stories** — Cohn *User Stories Applied* (INVEST) `[JUDGMENT]`.
- **Acceptance criteria / BDD (Given-When-Then)** — Gojko Adzic *Specification by Example*; Gherkin/Cucumber `[GATE]` Cucumber/SpecFlow.
- **Prioritization (MoSCoW / RICE / Kano)** — DSDM; Kano (1984) `[JUDGMENT]`.

---

# Phase II — Design

## 6. Visual & Brand Design

**Perceptual foundation**
- **Gestalt principles** — Koffka *Principles of Gestalt Psychology* `[JUDGMENT]` — proximity, similarity, closure, continuity, figure/ground.
- **Pre-attentive processing / visual perception** — Colin Ware *Information Visualization: Perception for Design* `[JUDGMENT]`.

**Elements & principles**
- **Elements of design** — Arnheim *Art and Visual Perception*; Wucius Wong `[JUDGMENT]`.
- **Principles of design** — Lauer & Pentak *Design Basics* `[JUDGMENT]` — balance, contrast, emphasis, rhythm, proportion, unity.
- **Visual hierarchy & scan patterns (F/Z/layer-cake)** — NN/g eye-tracking; Lidwell *Universal Principles of Design*; NN/g *5 Principles of Visual Design* `[JUDGMENT]`.

**Typography**
- **Foundational typography** — Bringhurst *The Elements of Typographic Style*; Lupton *Thinking with Type* `[JUDGMENT]`.
- **Type anatomy & classification** — Coles *Anatomy of Type*; Vox-ATypI `[JUDGMENT]`.
- **Modular type scales / vertical rhythm** — Tim Brown *Flexible Typesetting*; type-scale.com `[GATE]`.
- **Fluid/responsive type** — CSS `clamp()`; Utopia (utopia.fyi) `[GATE]`.
- **Web-font loading** — `font-display`, Zach Leatherman's guide `[GATE]` Lighthouse.
- **Variable fonts** — OpenType 1.8 (ISO 14496-22) `[GATE]`.
- **Practical web typography** — Butterick *Practical Typography* `[JUDGMENT]`.

**Color**
- **Color theory** — Albers *Interaction of Color*; Itten *The Art of Color* `[JUDGMENT]`.
- **Color science / spaces** — CIE 1931/CIELAB (CIE 15); OKLab/OKLCH (Ottosson); CSS Color 4 `[GATE]`.
- **Contrast (WCAG 2.x)** — WCAG 2.2 SC 1.4.3/1.4.11 `[GATE]` axe/WebAIM/Stark.
- **Perceptual contrast (APCA / WCAG 3)** — Myndex APCA `[GATE]` apcacontrast.com.
- **Color-blindness / CVD** — WCAG 1.4.1; ColorBrewer (Brewer) `[GATE]` Coblis.
- **Semantic/tonal color systems** — Material 3 HCT; Radix Colors `[GATE]`.

**Layout**
- **Grid systems** — Müller-Brockmann *Grid Systems in Graphic Design*; Samara *Making and Breaking the Grid* `[JUDGMENT]`.
- **Responsive layout** — Marcotte *Responsive Web Design*; CSS Grid/Flexbox `[GATE]`.
- **Spacing systems / 8-pt grid** — Material spacing `[GATE]` token lint.
- **Algorithmic layout primitives** — Bell & Pickering *Every Layout* `[GATE]`.

**Identity & style**
- **Brand identity design** — Alina Wheeler *Designing Brand Identity*; Neumeier *The Brand Gap* `[JUDGMENT]`.
- **Logo & marks** — Airey *Logo Design Love*; Mollerup *Marks of Excellence* `[JUDGMENT]`.
- **Aesthetic style genres** — Swiss/International (Müller-Brockmann, Ruder); Minimalism/Flat (Rams' 10 Principles); Neo-brutalism (brutalistwebsites.com); Glassmorphism/Neumorphism; Editorial; platform languages (Apple HIG, Material 3, Fluent 2) `[JUDGMENT]`.

**Tokens, icons, imagery, dataviz**
- **Design tokens & theming** — W3C DTCG Design Tokens Format (stable 2025-10) `[GATE]` Style Dictionary / Tokens Studio; tiered naming (Nathan Curtis) `[JUDGMENT]`.
- **Iconography** — Jon Hicks *The Icon Handbook*; SVG2 `[GATE]` SVGO; AIGA/DOT & ISO 7001 pictograms `[JUDGMENT]`.
- **Illustration / photography / art direction** — brand visual-language practice `[JUDGMENT]`; responsive imagery (`<picture>`/`srcset`, AVIF/WebP) `[GATE]` Lighthouse.
- **Data visualization** — Tufte *The Visual Display of Quantitative Information*; Munzner *Visualization Analysis and Design*; Wilkinson *Grammar of Graphics* / Vega-Lite `[GATE]`; Cleveland & McGill encoding ranking.
- **Visual regression** — `[GATE]` Chromatic / Percy / Playwright snapshots / BackstopJS.

## 7. Interaction, Motion & UI Patterns
- **Interaction design fundamentals** — Cooper et al. *About Face*; Norman *The Design of Everyday Things* `[JUDGMENT]`.
- **Laws of UX (Fitts, Hick, Miller, Jakob)** — Yablonski *Laws of UX* `[JUDGMENT]`.
- **Direct manipulation** — Shneiderman *Designing the User Interface* `[JUDGMENT]`.
- **UI pattern language** — Tidwell *Designing Interfaces*; ui-patterns.com `[JUDGMENT]`.
- **Navigation patterns** — Kalbach *Designing Web Navigation* `[JUDGMENT]`.
- **Search & faceted navigation** — Hearst *Search User Interfaces* `[JUDGMENT]`.
- **Widget patterns (menus/tabs/dialogs/comboboxes/carousels)** — WAI-ARIA APG `[GATE]` axe/APG.
- **Form & data-entry design** — Wroblewski *Web Form Design*; Baymard form research; inline validation `[JUDGMENT]`; accessible forms (WCAG 3.3) `[GATE]`.
- **Motion / animation** — Thomas & Johnston *The Illusion of Life* (Disney 12); Material 3 easing/choreography; Val Head *Designing Interface Animation* `[JUDGMENT]`; compositor-perf `[GATE]` DevTools.
- **Microinteractions** — Saffer *Microinteractions* `[JUDGMENT]`.
- **Reduced motion / seizure safety** — WCAG 2.3.3 / 2.3.1 `[GATE]` `prefers-reduced-motion`, PEAT.
- **View transitions** — CSS View Transitions L1/L2 `[GATE]` caniuse.
- **Scroll-driven & immersive** — CSS Scroll-driven Animations `[GATE]`; scrollytelling (GSAP ScrollTrigger); WebGL/Three.js (Bruno Simon *Three.js Journey*); Awwwards/FWA benchmarks `[JUDGMENT]`.
- **Perceived performance & states** — NN/g response-times; skeleton screens; empty/error/edge states; onboarding & progressive disclosure `[JUDGMENT]`.
- **Persuasion & behavioral design** — Fogg Behavior Model; Cialdini *Influence*; Eyal *Hooked*; Thaler & Sunstein *Nudge* `[JUDGMENT]`.
- **Web credibility & trust** — Fogg *Stanford Web Credibility Guidelines*; Baymard trust research `[JUDGMENT]`.
- **E-commerce & checkout UX** — Baymard *Checkout / Payment UX* research `[JUDGMENT]`.

## 8. Content Design & UX Writing
- **Content design (needs-first)** — Sarah Richards *Content Design*; GOV.UK content design `[JUDGMENT]`.
- **UX writing** — Podmajersky *Strategic Writing for UX* `[JUDGMENT]`.
- **Microcopy** — Kinneret Yifrah *Microcopy* `[JUDGMENT]`.
- **Plain language** — ISO 24495-1:2023; plainlanguage.gov `[JUDGMENT]`; readability (Flesch-Kincaid) `[GATE]` Hemingway.
- **Voice & tone** — Fenton & Kiefer Lee *Nicely Said*; Mailchimp Voice & Tone `[JUDGMENT]`.
- **Editorial style** — Chicago Manual; AP; Microsoft/Google style guides `[GATE]` Vale/proselint.
- **Inclusive / bias-free language** — Conscious Style Guide `[GATE]` alex (partial) / `[JUDGMENT]`.
- **Cognitive/health-literacy writing** — W3C COGA *Making Content Usable* `[JUDGMENT]`.

---

# Phase III — Build

## 9. Web Platform & Frontend Engineering
- **HTML semantics** — WHATWG HTML Living Standard; MDN `[GATE]` Nu HTML Checker.
- **CSS cascade & language** — W3C CSS Cascade L5; MDN `[JUDGMENT]`.
- **JavaScript / ECMAScript** — TC39 ECMA-262; MDN `[GATE]` ESLint/tsc.
- **TypeScript** — TS Handbook `[GATE]` `tsc --noEmit`.
- **DOM / Fetch / URL / Web IDL** — WHATWG standards `[JUDGMENT]`.
- **CSS architecture** — cascade layers `@layer`, container queries, nesting, custom properties `[GATE]` Baseline; BEM/ITCSS/SMACSS/OOCSS `[JUDGMENT]`; utility-first (Tailwind) / CSS-in-JS; Sass/PostCSS `[GATE]` stylelint; logical properties.
- **Component frameworks** — React/Vue/Svelte/Angular/Solid; meta-frameworks (Next/Nuxt/SvelteKit/Astro/Remix); Web Components (Lit) `[JUDGMENT]`.
- **State management** — Redux Toolkit / Zustand / XState `[JUDGMENT]`.
- **Server-state & data fetching** — TanStack Query / SWR `[JUDGMENT]`.
- **API integration** — OpenAPI 3.1 `[GATE]`; GraphQL spec `[GATE]`; WebSocket/SSE `[JUDGMENT]`.
- **Client forms & validation** — WHATWG constraint validation; Zod/React Hook Form `[GATE]`.

## 10. Design-System Engineering
- **Atomic design** — Brad Frost *Atomic Design* `[JUDGMENT]`.
- **Component API design & composition** — react.dev *Thinking in React* `[JUDGMENT]`.
- **Headless/accessible primitives** — Radix UI; React Aria (Adobe) `[JUDGMENT]`.
- **Component docs & workshops** — Storybook `[GATE]` test-runner.
- **Design-system as product** — Alla Kholmatova *Design Systems*; reference systems: GOV.UK, USWDS, Carbon `[JUDGMENT]`.

## 11. Rendering, Delivery & Infrastructure
- **Rendering taxonomy (CSR/SSR/SSG/ISR)** — patterns.dev (Hallie/Osmani); web.dev *Rendering on the Web* `[JUDGMENT]`.
- **Islands / streaming SSR / hydration / resumability** — patterns.dev; Astro; Qwik `[JUDGMENT]`.
- **Critical rendering path** — web.dev `[GATE]` Lighthouse.
- **Architecture patterns** — patterns.dev; Osmani *Learning JS Design Patterns*; micro-frontends; Module Federation `[GATE]`; monorepos (Nx/Turborepo) `[GATE]`.
- **Progressive enhancement & resilience** — Jeremy Keith *Resilient Web Design*; Gustafson *Adaptive Web Design* `[JUDGMENT]`; feature detection (`@supports`/Modernizr) `[GATE]`.
- **Browser compat & Baseline** — Baseline (WebDX); caniuse; MDN BCD `[GATE]` browserslist.
- **PWA / service workers / offline** — W3C App Manifest & Service Workers; Workbox `[GATE]` Lighthouse PWA.
- **Build tooling** — Vite/webpack/Rspack/esbuild/Rollup; Babel/SWC `[GATE]`; ESM/CJS.
- **Package mgmt & supply chain** — npm/pnpm/Yarn; SemVer 2.0; `[GATE]` `npm ci`, npm audit, Socket, OSV-Scanner.
- **Bundle budgets** — `[GATE]` size-limit / bundlesize / webpack-bundle-analyzer.
- **Linting & formatting** — ESLint / Prettier / Biome / Stylelint `[GATE]`.
- **Hosting / CDN / edge** — Vercel/Netlify/Cloudflare `[JUDGMENT]`.
- **DNS / TLS / HTTP** — RFC 1034/1035; TLS 1.3 (RFC 8446); HTTP/2·/3 (RFC 9113/9114); caching (RFC 9111) `[GATE]` SSL Labs / WebPageTest.
- **CI/CD & deploy** — GitHub Actions/GitLab CI `[GATE]`; blue-green/canary; Conventional Commits + semantic-release `[GATE]`; feature flags; 12-Factor config; Pro Git.

---

# Phase IV — Verify & Operate

## 12. Accessibility
- **WCAG 2.2 (A/AA/AAA)** — W3C Rec `[GATE]` axe-core / WAVE / IBM Equal Access / Pa11y / Lighthouse.
- **WCAG 3.0 readiness** — W3C Working Draft `[JUDGMENT]` (no stable gate).
- **CI a11y linting** — `[GATE]` jest-axe / cypress-axe / @axe-core/playwright / eslint-plugin-jsx-a11y.
- **ARIA correctness & APG patterns** — WAI-ARIA 1.2; ARIA APG `[GATE]` axe + `[JUDGMENT]` manual.
- **Screen-reader / AT testing** — ARIA-AT; NVDA/JAWS/VoiceOver/TalkBack `[JUDGMENT]` (Guidepup semi-automates).
- **Keyboard & focus management** — WCAG 2.1.1/2.4.3/2.4.7/2.4.11 `[JUDGMENT]`.
- **Accessible name computation** — ANDC 1.2 `[GATE]`.
- **Reflow / zoom / orientation** — WCAG 1.4.10/1.3.4 `[GATE]` partial + `[JUDGMENT]`.
- **Cognitive accessibility** — W3C COGA `[JUDGMENT]`.
- **Inclusive/universal design** — Microsoft Inclusive Design Toolkit; Kat Holmes *Mismatch* `[JUDGMENT]`.
- **Media alternatives (captions/transcripts/AD)** — WCAG 1.2.x `[JUDGMENT]`.
- **Audit methodology & conformance** — W3C WCAG-EM; ACT Rules Format; VPAT 2.5 `[JUDGMENT]`.

## 13. Performance
- **Core Web Vitals (LCP/INP/CLS)** — web.dev (INP replaced FID, 2024) `[GATE]` Lighthouse / PageSpeed / web-vitals.
- **Field data (RUM/CrUX)** — Chrome UX Report `[GATE]` CrUX / SpeedCurve / DebugBear / Vercel Speed Insights.
- **Lab auditing** — `[GATE]` Lighthouse CI / WebPageTest / Sitespeed.io.
- **Performance budgets** — `[GATE]` Lighthouse CI assertions / size-limit / Calibre.
- **Asset/bundle/image/font optimization** — web.dev `[GATE]` Sharp/Squoosh/glyphhanger/analyzers.
- **Critical CSS & render-blocking** — `[GATE]` Critical / Lighthouse.
- **Caching / CDN / protocol (HTTP/2·3, Brotli)** — `[GATE]` WebPageTest.
- **Main-thread / long tasks** — `[GATE]` DevTools Performance panel.
- **Resource hints** — W3C Resource Hints `[GATE]` Lighthouse.

## 14. Security
- **OWASP Top 10 (2025)** — owasp.org/Top10 `[GATE]` ZAP / Burp / Nuclei.
- **ASVS 5.0 verification levels** — OWASP ASVS `[JUDGMENT]` checklist.
- **SAST / DAST** — `[GATE]` Semgrep/CodeQL/SonarQube (static); ZAP/Burp (dynamic).
- **Dependency SCA & supply chain (SLSA)** — `[GATE]` Dependabot/Snyk/OSV-Scanner/Trivy.
- **SBOM & provenance** — CycloneDX/SPDX/SLSA `[GATE]` Syft/cosign.
- **Secret scanning** — `[GATE]` gitleaks/TruffleHog/GitHub secret scanning.
- **CSP L3 & SRI** — W3C `[GATE]` CSP Evaluator / srihash.org.
- **Security headers / HTTPS** — OWASP Secure Headers `[GATE]` Mozilla Observatory / securityheaders.com / SSL Labs.
- **XSS / CSRF prevention** — OWASP cheat sheets; Trusted Types `[GATE]` DOMPurify; SameSite `[JUDGMENT]`.
- **AuthN (OAuth 2.1 / OIDC / passkeys/WebAuthn)** — RFC 6749 / OIDC Core / WebAuthn L2 `[GATE]` FIDO/OIDC conformance.
- **AuthZ / access control** — OWASP A01 `[JUDGMENT]` (IDOR/SSRF).
- **Session & credential mgmt** — NIST SP 800-63B `[JUDGMENT]`.
- **Pen testing** — OWASP WSTG / PTES `[JUDGMENT]`.

## 15. Testing & Acceptance
- **Unit / integration** — Vitest/Jest + Testing Library; MSW `[GATE]`.
- **E2E** — Playwright / Cypress `[GATE]`.
- **Component** — Storybook test-runner / Playwright CT `[GATE]`.
- **Visual regression** — Chromatic / Percy / Applitools `[GATE]`.
- **Accessibility (in suite)** — jest-axe / @axe-core/playwright `[GATE]`.
- **BDD / acceptance criteria** — Cucumber/Gherkin; *Specification by Example* `[GATE]`.
- **Load / stress / soak** — k6 / Gatling / Locust / JMeter `[GATE]`.
- **Contract / API-schema** — Pact `[GATE]`; Schemathesis / Spectral (OpenAPI) `[GATE]`.
- **Mutation & property-based** — Stryker; fast-check `[GATE]`.
- **Coverage** — c8 / Istanbul / Codecov `[GATE]`.
- **Cross-browser/device** — BrowserStack / Sauce / Playwright browsers `[GATE]`.

## 16. SEO & Discoverability
- **Crawlability & indexing** — Google Search Essentials `[GATE]` Search Console / Screaming Frog.
- **robots.txt (RFC 9309) / XML sitemaps** — `[GATE]` GSC.
- **Structured data / Schema.org (JSON-LD)** — `[GATE]` Rich Results Test / validator.schema.org.
- **Canonicalization & redirects** — Google docs `[GATE]` Screaming Frog.
- **International SEO (hreflang)** — `[GATE]` hreflang validators.
- **Meta / OpenGraph / Twitter Cards** — OG protocol `[GATE]` card validators.
- **Core Web Vitals as ranking signal** — Google page experience `[GATE]` GSC.
- **E-E-A-T & content quality** — Google Search Quality Rater Guidelines `[JUDGMENT]`.
- **Generative Engine Optimization (AI search)** — emerging; llms.txt proposal `[GATE]` citation trackers (Profound/Otterly).

## 17. Analytics, Experimentation & Observability
- **Web/product analytics** — GA4 / Plausible / Matomo / PostHog `[GATE]`.
- **Event tracking & tracking-plan governance** — Segment/GTM; Avo `[GATE]`.
- **Funnels / session replay / heatmaps** — Amplitude/Mixpanel; Hotjar/Clarity `[GATE]`.
- **A/B & multivariate testing** — Optimizely/VWO/GrowthBook/Statsig `[GATE]`; significance/SRM checks.
- **Feature flags** — OpenFeature; LaunchDarkly/Unleash `[GATE]`.
- **CRO** — NN/g CRO frameworks `[JUDGMENT]`.
- **Error/crash monitoring** — Sentry/Rollbar/Bugsnag `[GATE]`.
- **Tracing / metrics / logs (observability)** — OpenTelemetry; Datadog/Grafana/Prometheus `[GATE]`.
- **RUM** — web-vitals + Sentry/Datadog RUM `[GATE]`.
- **Uptime / synthetic / status** — Checkly/Pingdom; Statuspage `[GATE]`.
- **SLOs / error budgets & incident mgmt** — Google SRE Book; incident.io `[GATE]`/`[JUDGMENT]`.
- **Chaos / resilience & DR** — Principles of Chaos Engineering; Gremlin `[GATE]`.

---

# Phase V — Govern (cross-cutting)

## 18. Internationalization & Localization
- **i18n engineering** — W3C Internationalization best practices `[GATE]` i18n linters / lang·dir checks.
- **Unicode & encoding** — The Unicode Standard; WHATWG Encoding `[GATE]`.
- **Locale data & formatting** — Unicode CLDR / ICU `[GATE]`.
- **Message formatting / pluralization** — ICU MessageFormat / MessageFormat 2.0 `[GATE]`.
- **Bidirectional text** — Unicode UAX #9; CSS logical properties `[GATE]`.
- **Localization interchange** — OASIS XLIFF 2.x; TMX; ISO 17100 `[GATE]`.
- **Pseudo-localization & i18n QA** — W3C i18n checker `[GATE]`.

## 19. Privacy, Ethics & Law
- **Privacy law** — GDPR (Reg. 2016/679); CCPA/CPRA; US state laws; ePrivacy/cookie law `[JUDGMENT]`.
- **Consent management** — EDPB Guidelines 05/2020; IAB TCF v2.2; Global Privacy Control `[GATE]` cookie scanners (Cookiebot/OneTrust).
- **Children's privacy** — COPPA; UK Age Appropriate Design Code `[JUDGMENT]`.
- **Privacy by design / DPIA** — GDPR Art. 25/35; ISO 31700 `[JUDGMENT]`.
- **Deceptive/dark patterns** — Brignull deceptive.design; FTC (2022 report); EDPB 03/2022; DSA Art. 25 `[JUDGMENT]` + consent-banner scanners `[GATE]`.
- **Ethical / humane design** — Center for Humane Technology; Friedman & Hendry *Value Sensitive Design*; IEEE 7000-2021 `[JUDGMENT]`.
- **Responsible AI in UX** — EU AI Act (Reg. 2024/1689); NIST AI RMF `[JUDGMENT]`.
- **Accessibility law** — ADA (Title II 2024 rule → WCAG 2.1 AA); Section 508; EN 301 549; European Accessibility Act (June 2025); AODA; Accessible Canada Act; UK Equality Act `[JUDGMENT]`.
- **InfoSec governance** — ISO/IEC 27001; NIST CSF 2.0; SOC 2 `[JUDGMENT]`.

## 20. Sustainability
- **Web Sustainability Guidelines** — W3C WSG (W3C work since Oct 2024) `[JUDGMENT]` + partial `[GATE]`.
- **Carbon estimation** — Sustainable Web Design Model v4 `[GATE]` CO2.js / Website Carbon / EcoGrader.
- **Green hosting / grid intensity** — Green Web Foundation directory/API `[GATE]`.
- **Performance-as-sustainability** — Core Web Vitals / budgets as efficiency proxy `[GATE]`.

## 21. Design Ops & Governance
- **Design-system governance & contribution** — Nathan Curtis (EightShapes); *Design Systems Handbook* `[JUDGMENT]`.
- **Versioning & release** — SemVer 2.0; Conventional Commits; Changesets `[GATE]`.
- **Design tokens standard** — W3C DTCG Format `[GATE]`.
- **Design-to-code handoff** — Figma Dev Mode; Style Dictionary pipelines `[GATE]`.
- **Documentation** — Diátaxis framework; docs-as-code `[JUDGMENT]`.
- **Brand & content governance** — brand books; editorial style governance `[JUDGMENT]`.
- **Legal notices** — ToS / privacy notices / imprint (e.g. DE TMG §5) `[JUDGMENT]`.

---

## Appendix A — The enforceable gate stack (the `[GATE]` subset)

The subset a builder can turn into automated red/green checks in CI:

| Dimension | Primary gate tool(s) | Standard behind it |
|---|---|---|
| Markup validity | Nu HTML Checker | HTML Living Standard |
| Accessibility | axe-core (jest/cypress/playwright), Pa11y, Lighthouse | WCAG 2.2 AA / ARIA |
| Color contrast | axe, Stark, APCA calculator | WCAG 1.4.3/1.4.11, APCA |
| Performance | Lighthouse CI, PageSpeed, web-vitals, CrUX | Core Web Vitals |
| Bundle size | size-limit, bundlesize | performance budgets |
| Security (headers) | Mozilla Observatory, CSP Evaluator, SSL Labs | CSP L3, OWASP Secure Headers |
| Security (code/deps) | Semgrep/CodeQL, Snyk/OSV-Scanner, gitleaks | OWASP Top 10 / ASVS |
| Functional / acceptance | Playwright + Cucumber (Gherkin) | Specification by Example |
| Visual regression | Chromatic / Percy / Playwright snapshots | design-system consistency |
| SEO / structured data | Rich Results Test, Screaming Frog, Lighthouse SEO | Google Search Essentials, Schema.org |
| Design tokens | Style Dictionary, Tokens Studio | W3C DTCG format |
| i18n | W3C i18n checker, ICU/CLDR validation | Unicode / W3C i18n |
| Sustainability | CO2.js, Website Carbon | W3C WSG / SWDM v4 |
| Code quality | ESLint, Prettier, Stylelint, tsc | ECMAScript / project config |

Everything **not** in this table is `[JUDGMENT]` — encoded as a checklist a subagent
applies and reasons about, not a pass/fail scanner.

## Appendix B — Scope decision (per domain: generate / consume / validate)

A "site builder" does not own all 21 domains equally. For each, decide whether the
builder **generates** it, **consumes** it as a brief/input, or only **validates** it.
Upstream domains (UX research, IA strategy, content strategy, experimentation design)
are typically *consumed as a brief*; design/build/verify domains are *generated and
validated*. This line is the single decision that most shapes which skills get built.

## Appendix C — The de facto "reference BoK" convergence points

If you want the smallest set of *authored-to-converge-on* corpora to anchor everything:

- **MDN Curriculum** — front-end skills baseline (Mozilla positions it as the standard).
- **web.dev/learn** — Google's codified courses (HTML/CSS/JS/Accessibility/Performance/Design/Forms/Images/PWA/Testing/Privacy).
- **patterns.dev** — rendering & architecture patterns (Osmani/Hallie).
- **W3C normative specs** — HTML/CSS/WCAG/ARIA/Design Tokens as the enforceable floor.
- **NN/g** — usability & UX judgment.
- **Refactoring UI** — the developer-facing codification of visual taste.

---

*Assembled via a seven-branch research sweep. Tiering: normative standard · de facto
reference · recognized canon. Flags: `[GATE]` machine-verifiable · `[JUDGMENT]`
codified-checklist. This document locates the canon; it does not implement it.*
