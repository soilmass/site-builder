#!/usr/bin/env node
/**
 * SessionStart — inject where a build is + the Definition of Done into context.
 * (Doing this here is the audit-recommended way to surface plugin doctrine, since a
 * plugin-root CLAUDE.md is NOT auto-loaded.) Emits SessionStart additionalContext JSON.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const site = join(projectDir, ".site");
if (!existsSync(site)) process.exit(0);

const phases = [
  ["brief.md", "brief"],
  ["ia.md", "IA"],
  ["content.md", "content"],
  ["acceptance", "acceptance criteria"],
  ["tokens.json", "tokens"],
  ["reports/summary.md", "gates run"],
  ["review", "reviewed"],
  ["done.md", "SHIPPED"],
];

const reached = phases.filter(([p]) => existsSync(join(site, p))).map(([, l]) => l);
const shipPending = existsSync(join(site, "ship.requested")) && !existsSync(join(site, "done.md"));

const lines = [
  `[site-builder] active build — progress: ${reached.join(" → ") || "started"}.`,
  "Definition of Done before ship: every acceptance feature passes; .site/reports/summary.md is STATUS: PASS;",
  "every .site/review/*.md is VERDICT: PASS; no dark patterns. The DoD Stop hook blocks a pending ship while red.",
];
if (shipPending) lines.push("A ship is pending now; resolve red items before finishing.");

const out = {
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: lines.join(" "),
  },
};
process.stdout.write(JSON.stringify(out));
process.exit(0);
