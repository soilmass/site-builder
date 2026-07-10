# Stack Truths — verified by the Milestone 0 scaffold spike

Facts recorded from actually running the tools, not from memory. Where memory and this file
disagree, this file wins for the current environment. Re-run the spike if the toolchain moves.

**Spike date context:** run in the Site Builder remote environment. **Discard the spike app; keep
this file** (spec §3, guide M0).

---

## Verified toolchain versions

| Tool | Version | How obtained |
|---|---|---|
| Node | 22.22.2 | environment |
| pnpm | 10.33.0 | environment |
| Next.js | **16.2.10** | `create-next-app` |
| React / react-dom | 19.2.4 | `create-next-app` |
| Tailwind CSS | **4.3.2** | `create-next-app --tailwind` |
| @tailwindcss/postcss | 4.3.2 | " |
| TypeScript | 5.9.3 | " |
| ESLint | 9.39.4 | " |
| eslint-config-next | 16.2.10 | " |
| gsap | 3.15.0 | `pnpm add gsap` |
| @gsap/react | 2.1.2 | " |
| lenis | 1.3.25 | " |
| @playwright/test | 1.61.1 | `pnpm add -D` |
| @axe-core/playwright | 4.12.1 | " |

> **Next 16, not 14/15.** Newer than most training memory — validate App-Router API assumptions
> against 16 docs, not older mental models.

---

## Scaffold command (verified)

```bash
pnpm dlx create-next-app@latest <name> \
  --ts --app --tailwind --eslint --use-pnpm --no-src-dir --import-alias "@/*" --no-turbopack
```
- Generates `AGENTS.md` **and** `CLAUDE.md` at the repo root by default — delete/replace for our own
  `.claude/CLAUDE.md`, and be aware create-next-app will scaffold a root `CLAUDE.md` we don't want.
- `tsconfig.json` paths: `"@/*": ["./*"]`.
- No `src/` dir (chose `--no-src-dir`); app lives at `app/`.

## Tailwind v4 wiring (verified — this is the token-law substrate)

- **CSS-first config; there is no `tailwind.config.js`.** `postcss.config.mjs` loads
  `@tailwindcss/postcss`.
- `app/globals.css` pattern:
  ```css
  @import "tailwindcss";

  :root { --background: #ffffff; --foreground: #171717; }

  @theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
  }
  ```
- **Implication for the spec's token law (§13):** `design/tokens.css` defines the raw CSS variables;
  `@theme inline` maps them to `--color-*` / spacing / font utilities. The ESLint arbitrary-value ban
  (`p-[13px]`, hex outside tokens) enforces that authored classes only ever reference these tokens.

## shadcn on Tailwind v4 + Next 16 (verified — highest-uncertainty integration, and it works)

```bash
pnpm dlx shadcn@latest init -d --yes
pnpm dlx shadcn@latest add button --yes
```
- `init` writes `components.json`, `components/ui/`, `lib/utils.ts`, and **appends shadcn tokens to
  `app/globals.css`**. `add` is idempotent (skips identical files unless `--overwrite`).
- Confirms the spec's "`components/ui/` read-only after install" model: primitives land in
  `components/ui/`, which the protect hook (M1) locks.

## GSAP + Lenis + SplitText (verified: compiles **and** runs in-browser)

- Register once in the client component: `gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)`.
- **SplitText imports from `gsap/SplitText` and is free** — no license/trial gate hit. Confirmed at
  runtime: a heading became **18 char `<div>`s** (`position: relative; display: inline-block`) after
  splitting behind `document.fonts.ready`. This validates spec §12.1.
- **Lenis↔GSAP single-loop wiring (spec §12.2), verified working:**
  ```ts
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- All animation inside `useGSAP(() => {...}, { scope: root })` from `@gsap/react` — the pattern the
  motion-choreography skill (M4) ships as its worked example.
- A pinned `scrub` ScrollTrigger and the SplitText reveal both ran during a scripted scroll with
  **zero console errors and zero page errors**.

## Build (verified)

- `pnpm build` succeeds; **Next 16 builds with Turbopack by default** (output shows
  `Next.js 16.2.10 (Turbopack)`), even though `--no-turbopack` was passed to create-next-app (that
  flag governs dev, not build).
- `pnpm start -p <port>` serves the prod build; responds 200. This is the Lighthouse target path
  (`pnpm build && pnpm start`).
- TypeScript typechecks as part of `next build`.

---

## Capture-stack gotchas (critical for M2 filmstrip/regression and M3 validator)

These two cost real debugging time in the spike; bake them into the capture helpers and the validator
subagent so they're not rediscovered later.

1. **Playwright browser version pin mismatch.** Pre-installed browsers under `/opt/pw-browsers` are
   build **1194**; `@playwright/test@1.61.1` expects **1228**. **Do NOT run `playwright install`**
   (blocked/pointless here). Launch with an explicit `executablePath`:
   - Headed/full Chromium: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
   - Headless shell: `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
   In `playwright.config.ts`, set `use.launchOptions.executablePath` (or per-project) to the full
   Chromium path above. Revisit the `1194` number if the image updates.
2. **axe-core needs a context-created page.** `@axe-core/playwright` throws *"Please use
   browser.newContext()"* if handed a `browser.newPage()` page. Always
   `const ctx = await browser.newContext(...); const page = await ctx.newPage();`.
3. **ffmpeg is pre-installed** at `/opt/pw-browsers/ffmpeg-1011` — filmstrip keyframe extraction (M2)
   has its dependency without extra install.

---

## Runtime verification summary (what the browser actually showed)

- Console errors: **0**. Page errors: **0**.
- axe-core violations on the default template: **0** (baseline sanity, not a real a11y pass).
- SplitText: heading split into 18 char elements behind `document.fonts.ready`. ✅
- Scripted scroll exercised a pinned scrub scene without error. ✅

## Not yet run in this spike (open for the milestone that needs them)

- **Lighthouse CI audit itself.** The prod-build-and-serve path is verified (`pnpm build` ok, `pnpm
  start` serves 200), but the `lhci autorun` / Lighthouse score run was not executed here. Stand it up
  in M2/M3 against `pnpm build && pnpm start` and record the real first-load-JS numbers per route
  then.
- **DevTools MCP smoothness trace** (spec §11 smoothness gate) — local-only, deferred to M3/Phase 3.
- **Immersive tier** (`@react-three/fiber`, shaders) — not installed; gap-list item 4 still open,
  blocks only immersive projects.
