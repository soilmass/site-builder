#!/usr/bin/env node
/**
 * Definition-of-Done gate — the keystone Stop hook.
 *
 * Design goal: enforce "you cannot conclude a ship while any gate is red or any
 * reviewer flagged a blocker," WITHOUT trapping normal mid-build iteration.
 *
 * Mechanism: it only acts when a ship has been *requested* (the `/site-builder:ship`
 * command drops a `.site/ship.requested` sentinel). On any other Stop it no-ops, so
 * ordinary turns are never blocked. When a ship is pending, it evaluates the DoD and
 * blocks (exit 2) with the specific failures until everything is green.
 *
 * Contract it reads (all under the project's `.site/` dir):
 *   reports/summary.md   must contain a line `STATUS: PASS`
 *   review/<name>.md     each must contain a line `VERDICT: PASS` (any `VERDICT: BLOCK` fails)
 *   ship.requested       presence = a ship is pending
 *   done.md              presence = already shipped (no-op)
 *
 * Exit codes: 0 = allow stop; 2 = block and force continue (Claude Code convention).
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const cwd = process.cwd();
const siteDir = join(cwd, ".site");

function allow() {
  process.exit(0);
}

function block(reasons) {
  const body = [
    "Definition of Done not met — a ship is pending but quality gates are red.",
    "Fix the following, re-run `/site-builder:verify` and `/site-builder:review`, then ship again:",
    "",
    ...reasons.map((r) => `  ✗ ${r}`),
    "",
    "(This block comes from the site-builder DoD Stop hook. Do not claim the site is done while these fail.)",
  ].join("\n");
  console.error(body);
  process.exit(2);
}

// Not inside a site project, or no ship pending → never block.
if (!existsSync(siteDir)) allow();
if (existsSync(join(siteDir, "done.md"))) allow();
if (!existsSync(join(siteDir, "ship.requested"))) allow();

const reasons = [];

// 1. Gate summary must be green.
const summaryPath = join(siteDir, "reports", "summary.md");
if (!existsSync(summaryPath)) {
  reasons.push("no gate report found — run `/site-builder:verify` (expected .site/reports/summary.md)");
} else {
  const summary = readFileSync(summaryPath, "utf8");
  if (!/^STATUS:\s*PASS\s*$/m.test(summary)) {
    // Surface any explicit failing gate lines to make the fix obvious.
    const fails = summary
      .split("\n")
      .filter((l) => /\b(FAIL|✗)\b/.test(l))
      .map((l) => l.trim());
    reasons.push("gate summary is not STATUS: PASS");
    for (const f of fails.slice(0, 12)) reasons.push(`gate: ${f}`);
  }
}

// 2. Every judgment review present must be PASS; none may BLOCK.
const reviewDir = join(siteDir, "review");
if (existsSync(reviewDir)) {
  for (const file of readdirSync(reviewDir)) {
    if (!file.endsWith(".md")) continue;
    const text = readFileSync(join(reviewDir, file), "utf8");
    if (/^VERDICT:\s*BLOCK\s*$/m.test(text)) {
      reasons.push(`reviewer blocked: ${file}`);
    } else if (!/^VERDICT:\s*PASS\s*$/m.test(text)) {
      reasons.push(`reviewer inconclusive (no VERDICT: PASS): ${file}`);
    }
  }
} else {
  reasons.push("no judgment reviews found — run `/site-builder:review` (expected .site/review/*.md)");
}

if (reasons.length > 0) block(reasons);
allow();
