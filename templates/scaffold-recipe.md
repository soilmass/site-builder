# Scaffold recipe — de facto stack, minimal invention

The `/site-builder:build` command scaffolds a new site with standard tools, then copies the gate
overlay on top. **Do not hand-author an app** — use these de facto steps.

## 1. Create the app (create-next-app)

```bash
npx create-next-app@latest . \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

This gives Next.js (App Router) + React 19 + Tailwind v4 + TypeScript + ESLint + the `@/*` alias —
all configured. No bespoke config needed.

## 2. Add accessible components (shadcn/ui)

```bash
npx shadcn@latest init          # sets up theming (CSS vars + Tailwind @theme) and utils
npx shadcn@latest add button navigation-menu dialog   # add per the plan; each is Radix-based & accessible
```

shadcn gives component **source you own**, built on Radix (keyboard/focus/ARIA handled). Theming is
CSS variables in `app/globals.css` + Tailwind v4 `@theme` — this is the primary token system.
(`/site-builder:tokens` edits these variables; a DTCG export is optional, not required.)

## 3. Add the gate toolchain (de facto CLIs)

```bash
npm i -D @playwright/test @axe-core/playwright @lhci/cli html-validate @tgwf/co2
npx playwright install --with-deps chromium
```

## 4. Copy the gate overlay

Copy `templates/overlay/*` into the project (preserving paths):

- `playwright.config.ts` — runs gates against `next build && next start`
- `tests/a11y.spec.ts` — `@axe-core/playwright`, WCAG 2.2 AA (the `a11y-gate`)
- `tests/visual.spec.ts` — Playwright screenshots (the `visual-regression-gate`)
- `scripts/validate-html.mjs` — html-validate on rendered HTML (the `semantics-gate`)
- `lighthouserc.json` — Lighthouse CI budgets (the `performance-gate`, also SEO/best-practices)
- `.github/workflows/gates.yml` — runs the gates on every push

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "gate:a11y": "playwright test tests/a11y.spec.ts",
    "gate:visual": "playwright test tests/visual.spec.ts",
    "gate:semantics": "node scripts/validate-html.mjs",
    "gate:perf": "lhci autorun"
  }
}
```

## 5. Security headers (overlay note)

Merge the headers from `templates/overlay/next.config.headers.md` into the generated `next.config`
so the `security-gate` passes (CSP/HSTS/X-Content-Type-Options/etc.).

> Everything here is standard tooling. site-builder's only additions are the gate **specs/configs**
> above and the workflow that sequences them — no reinvented framework, template, or token pipeline.
