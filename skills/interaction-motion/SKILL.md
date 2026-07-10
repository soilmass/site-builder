---
name: interaction-motion
description: "Add purposeful motion and microinteractions as a final enhancement layer. Use last in the build phase, after the static composition is right. Always reduced-motion guarded."
---

# interaction-motion

Motion is the **last** layer — an enhancement on a solid static composition, never a fix for a weak
one. Extends `frontend-design`'s single motion note. Canon: Disney's 12 principles (*The Illusion of
Life*); Material 3 motion; Saffer, *Microinteractions*.

## Rules

- **Purpose only.** Motion should orient, give feedback, show relationships, or reward — page-load
  sequence, scroll reveals, meaningful hovers, state transitions. Cut anything decorative; scattered
  effects are the tell of AI generation.
- **Easing and duration from tokens.** Natural curves (ease-out for entrances, standard for moves),
  short durations (~150–300ms for UI). No linear, no slow.
- **Choreography.** Sequence related elements (stagger, shared-axis, container transform); one thing
  leads, others follow — don't animate everything at once.
- **Microinteractions have structure** — trigger → feedback → resolution. Hover/active/loading/
  success cues that confirm the system heard the user.
- **Respect `prefers-reduced-motion`** — provide a reduced/near-static path for every animation.
  Non-negotiable; the a11y gate and reviewer check it.
- **Cheap to render.** Animate compositor-friendly properties (transform/opacity); protect INP/CLS.
- **Spend boldness in one place** (from `visual-taste`): one signature motion moment, everything else quiet.

## Quality bar (god-tier)
- Remove all motion and the page is still excellent; motion makes it feel *alive*, not busy.
- With reduced-motion on, nothing breaks and nothing important is lost.

## Feeds
The finished build → `verify`. Motion performance is checked by the perf gate.
