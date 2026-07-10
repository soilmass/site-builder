# Pilot report — "Ember" landing page

First end-to-end run of the site-builder pipeline against the **real** toolchain. Purpose: prove the
plugin composes and settle the previously-untested scaffold/token pieces (architecture §11, M1).

## Result: PASS end-to-end

Built a marketing landing page ("Ember", a small-batch coffee roaster) through the full sequence
(`brief → plan → tokens → build → verify → review → ship`) and verified it:

| Gate | Result | Tool |
|---|---|---|
| Build | ✅ compiles + static-generates | `next build` |
| a11y | ✅ 0 serious/critical WCAG 2.2 AA | `@axe-core/playwright` |
| performance | ✅ all LHCI budgets met (3 runs) | Lighthouse CI |
| semantics | ✅ valid (retuned ruleset) | html-validate |
| visual | ✅ baseline set + verified | Playwright |
| taste / manual-a11y / content | ✅ `VERDICT: PASS` | judgment reviewers |

**DoD Stop hook proven end-to-end against real gate output:** green + ship pending → **exit 0
(allow)**; injected gate failure → **exit 2 (block)** with the reason; shipped → exit 0.

The token-time contrast discipline worked: warming shadcn's neutrals + darkening the borderline
`muted-foreground` at token time meant the a11y contrast checks passed *by construction*.

## Findings folded back into the plugin

The pilot surfaced real truths our authored-from-memory docs had wrong — now corrected:

1. **`create-next-app@latest` → Next 16 / React 19.2 / Tailwind v4** (docs said Next 15).
2. **shadcn migrated off Radix to Base UI** (`@base-ui/react`). Components are still shadcn/ui, but
   "Radix" references were corrected across the skills/commands/recipe/README.
3. **shadcn `Button` has no `asChild`.** Link-buttons must use `buttonVariants({...})` on an `<a>`;
   `<Button>` is for real actions (or its `render` prop). Corrected in `component-craft`.
4. **shadcn CLI flags changed** — `init -d -y` (the old `-b <color>` enum changed). Corrected in the
   scaffold recipe.
5. **Semantics gate was mis-tuned** — `html-validate:recommended` flagged framework-serialized `<head>`
   (self-closing `<meta/>`, `charSet`, React `_R_` ids) as errors. Retuned to `html-validate:standard`
   with stylistic rules off and structural/a11y rules on. Fixed in `templates/overlay/`.

## Environment-only notes (not plugin defects)

- The sandbox pins Chromium 1194 and forbids `playwright install`; the pilot pointed Playwright at the
  pre-installed binary via `executablePath`. Real CI (the overlay's `gates.yml`) runs
  `npx playwright install --with-deps chromium` and needs no such override.
- LHCI needed `--no-sandbox` chrome flags in this container.
