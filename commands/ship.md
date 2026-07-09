---
description: "Phase 6 — check Definition of Done and ship. Blocks if any gate or review is red."
allowed-tools: "Bash Read Write Edit"
---

# /site-builder:ship — Definition of Done & handoff

This is the gate to finishing. It works with the DoD Stop hook via a sentinel:

1. **Request the ship** — create the sentinel `.site/ship.requested`. From this point, the DoD
   Stop hook will **block any attempt to end the turn** until the Definition of Done is fully green.

2. **Verify the Definition of Done** (from CLAUDE.md), reading the evidence:
   - `.site/reports/summary.md` is `STATUS: PASS`,
   - every `.site/acceptance/*.feature` passes (via the acceptance-gate line in the summary),
   - every `.site/review/*.md` is `VERDICT: PASS`.

3. **If anything is red:** do NOT try to finish (the hook will block you anyway). Report exactly
   what's red and route back to `/site-builder:build`. Leave the sentinel in place.

4. **If everything is green:** write `.site/done.md` summarizing the shipped state with the evidence
   (gate results + review verdicts), remove `.site/ship.requested`, and perform the handoff the user
   asked for (e.g. open a PR or prepare the deploy) — only if the user explicitly requested it.

Report with evidence, per the site-craft output style. Never declare the site shipped unless
`.site/done.md` was actually written.
