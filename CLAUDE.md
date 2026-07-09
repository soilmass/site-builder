# site-builder (repository notes)

> This is the **plugin repository's own** dev note. A plugin-root `CLAUDE.md` is NOT loaded into
> Claude Code sessions where the plugin is used — so the runtime doctrine lives in
> `skills/site-builder/SKILL.md` (auto-activating) and is reinforced by the SessionStart hook.
> Do not put runtime rules here expecting them to load.

## Repo map

- `skills/site-builder/SKILL.md` — the runtime doctrine (taste kernel, Next.js/shadcn conventions,
  Definition of Done, compose-with-superpowers).
- `commands/` — the 7-command spine.
- `agents/` — gate runners + judgment reviewers.
- `hooks/` + `scripts/` — the DoD Stop hook and helpers.
- `templates/` — the create-next-app + shadcn scaffold recipe and gate-config overlay.
- `docs/knowledge-base.md` — the located body of knowledge.
- `docs/architecture.md` — how the canon maps onto Claude Code primitives.

## Design stance

Invent as little as possible: compose with **superpowers** for methodology, scaffold with
**create-next-app + shadcn/ui**, theme with **Tailwind v4 + shadcn tokens**, and gate with de facto
CLIs (Lighthouse CI, axe, html-validate, CO2.js) via thin wrappers. What remains ours: the website
taste/gate knowledge skills, the DoD Stop hook, thin orchestration, and gate configs.
