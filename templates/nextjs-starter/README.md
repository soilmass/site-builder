# site-builder — Next.js starter

The scaffold the `site-builder` plugin generates high-end sites from. Ships tokens, accessible
primitives, and quality gates wired to the plugin's Definition of Done.

## Stack

- **Next.js (App Router)** — RSC by default, client only at interactive leaves.
- **Tailwind CSS v4** with `@theme` fed from `design/tokens.json` via **Style Dictionary**
  (`npm run tokens` → `app/theme.css`). Components use tokens/utilities only.
- **Radix Primitives** for accessible interactive widgets.
- **next/image** + **next/font** for media/fonts.

## Gates (map to the plugin's verify phase)

| Command | Gate | Tool |
|---|---|---|
| `npm run gate:a11y` | accessibility | Playwright + axe (WCAG 2.2 AA) |
| `npm run gate:visual` | visual regression | Playwright screenshots |
| `npm run gate:semantics` | HTML semantics | html-validate (needs server up) |
| `npm run gate:perf` | performance/SEO/best-practices | Lighthouse CI |

## Local dev

```bash
npm install
npm run dev        # regenerates tokens, then next dev
```

To run gates locally: `npm run build` then the `gate:*` scripts. `gate:semantics` expects a running
server (`npm run start`) on :3000. CI runs the gates on every push (`.github/workflows/gates.yml`).

> This starter is authored by the plugin; the `/site-builder` workflow replaces the placeholder hero,
> regenerates tokens per brand, and adds the pages/components for your brief.
