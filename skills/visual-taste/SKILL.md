---
name: visual-taste
description: "Make websites look genuinely designed — distinctive AND fundamentally correct. Use for any visual/layout/typography/color decision, hero and section design, or when a page risks looking templated or generic."
---

# visual-taste

High-end sites need **two layers**, and most AI output nails neither: a **correctness kernel** (why
anything looks "designed") under a committed **aesthetic direction** (why it looks like *this*
subject and not a template). Do both. Direction without the kernel is a loud mess; the kernel
without direction is competent and forgettable.

> Builds on Anthropic's `frontend-design` skill and the [Frontend Aesthetics Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb)
> for the direction layer, and on Refactoring UI, NN/g's 5 Principles of Visual Design, and Gestalt
> for the kernel. It integrates with our shadcn token system and the contrast/a11y gate.

---

## Layer 1 — The correctness kernel (applies to EVERY site, every archetype)

Non-negotiable. Verify each before considering direction:

1. **Hierarchy is engineered, not incidental.** Control scan order with size, weight, and color.
   *De-emphasize* secondary content (muted color, smaller) rather than emphasizing everything. One
   clear focal point per view.
2. **Spacing is a system.** Use the token spacing scale only (8pt-based). Start with *too much*
   whitespace and remove; generous negative space reads as premium. Never cramped, never arbitrary.
3. **Type is a fixed scale.** A modular scale, limited weights (2–3), body ≥ 16px, comfortable
   measure (~45–75ch), line-height ~1.5 for body / ~1.15 for headings. `text-wrap: balance` on headings.
4. **Color has roles, and contrast is a floor.** Semantic tokens only (never raw hex in components).
   Every text/action pairing meets **WCAG 2.2** (4.5:1 text, 3:1 large/UI). This is checked by the
   a11y gate — get it right at token time (see `design-tokens`).
5. **Depth is deliberate.** Elevation/shadow from the token ramp, used to signal layering, not decoration.
6. **Alignment on a real grid.** Everything sits on the layout grid; use Gestalt (proximity groups
   related things, similarity unifies, common-region via cards) to structure meaning.

If a visual choice can't be expressed in tokens, the token system is incomplete — fix the tokens.

---

## Layer 2 — The aesthetic direction (make it distinctive, not templated)

Adopted from `frontend-design`, extended and stack-integrated.

### Ground it in the subject
Name the concrete **subject, audience, and single job** first. Distinctiveness comes from the
subject's own world — its materials, instruments, artifacts, vocabulary — not from a style grab-bag.

### Design principles
- **Hero as thesis.** Open with the most characteristic element of the subject's world, chosen
  deliberately — not "big headline + generic gradient."
- **Typography as personality.** Pair a characteristic display face with a clean body face (and a
  utility face for captions/data). Type carries more identity than color.
- **Structure encodes meaning.** Numbering, dividers, and section rhythm should reflect real content
  hierarchy, not decoration.
- **Motion serves purpose.** Page-load sequence, scroll reveals, purposeful hovers — never scattered
  effects. (See `interaction-motion`; always guard `prefers-reduced-motion`.)
- **Match complexity to vision.** Maximalism demands elaborate execution; minimalism demands
  precision in spacing and detail. Don't do half-maximalism.

### Spend your boldness in one place
Choose **one signature element** to be the memorable thing. Keep everything around it quiet and
disciplined. Cut any decoration that doesn't serve the brief. Restraint is what separates high-end
from busy.

### Avoid genericness by principle (not a frozen list)
Reject anything that reads as a default: predictable purple/blue gradients, generic system-font
headings, cookie-cutter card grids, decorative-only motion. The specific clichés change over time —
the test is: *"could this be any other site?"* If yes, it's not grounded enough in the subject.

---

## Archetype calibration (correcting the bold-by-default bias)

Direction is **not** always "bold." Calibrate:

- **Marketing / landing / brand** → distinctiveness high; a strong signature element earns attention.
- **Portfolio / editorial** → typographic craft and rhythm lead; let the work be the hero.
- **Docs / app / dashboard / enterprise** → restraint and clarity dominate; the "signature" is
  precision, density done well, and effortless scanning — not spectacle. Loudness here is a defect.

Match the boldness dial to the job. The kernel (Layer 1) never relaxes; only the direction dial moves.

---

## Process: two passes, critique before code

1. **Design plan** (before building): a compact token intent (color roles + hexes, display/body/utility
   type, spacing feel, the signature element) expressed against the shadcn theme — see `design-tokens`.
   Sketch section layout in prose/ASCII.
2. **Critique the plan** against the brief: is each choice subject-specific or a default? Does contrast
   pass? Is boldness concentrated in one place? Revise, then build. This critique is also run
   independently later by the `taste-reviewer` subagent.

## Dark mode is not an afterthought

"Weird dark mode" is the single most common AI tell. If the site has a dark theme, design it
deliberately: it is not "invert the light theme." Surfaces get *lighter* with elevation (not darker),
pure black/white are avoided (use near-black/near-white from tokens), and **every pairing is
contrast-checked in dark too**. Test both themes; both must pass the a11y gate and read as designed.

## Stack integration

- Express all of the above as **shadcn CSS-variable tokens + Tailwind v4 `@theme`** (via `design-tokens`),
  not inline styles. The `component-craft` skill turns the plan into RSC + shadcn components.
- Contrast is verified by the **a11y gate**; distinctiveness/hierarchy/restraint by the
  **taste-reviewer**. Get them right here so both pass by construction.
