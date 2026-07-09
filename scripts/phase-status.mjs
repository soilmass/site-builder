#!/usr/bin/env node
/**
 * SessionStart — surface where a site build is, so a resumed session has context.
 * Prints a short status line to stdout (added to context). Always exits 0.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

const site = join(process.cwd(), ".site");
if (!existsSync(site)) process.exit(0);

const phases = [
  ["brief.md", "brief captured"],
  ["ia.md", "IA planned"],
  ["content.md", "content drafted"],
  ["acceptance", "acceptance criteria written"],
  ["tokens.json", "design tokens generated"],
  ["reports/summary.md", "gates run"],
  ["review", "reviewed"],
  ["done.md", "SHIPPED"],
];

const reached = phases.filter(([p]) => existsSync(join(site, p))).map(([, label]) => label);
const shipPending = existsSync(join(site, "ship.requested")) && !existsSync(join(site, "done.md"));

if (reached.length) {
  console.log(`[site-builder] active build — progress: ${reached.join(" → ")}.`);
  if (shipPending) console.log("[site-builder] a ship is pending; the DoD gate will block until reports are green.");
}
process.exit(0);
