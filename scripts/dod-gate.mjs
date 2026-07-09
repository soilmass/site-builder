#!/usr/bin/env node
/**
 * Definition-of-Done gate — the keystone Stop hook.
 *
 * Enforces "you cannot conclude a ship while any gate is red or any reviewer flagged a
 * blocker," without trapping normal iteration. It only acts when a ship has been
 * *requested* (the `/site-builder:ship` command drops `.site/ship.requested`). On any
 * other Stop it no-ops.
 *
 * Robustness (audit fixes):
 *   - Resolves the project dir via $CLAUDE_PROJECT_DIR (falls back to cwd).
 *   - Reads the hook payload (stop_hook_active) from stdin.
 *   - Release valve: after MAX_BLOCKS consecutive blocks it allows the stop with a loud
 *     warning, so a genuinely-unfixable gate can never hard-trap the session. The block
 *     message also states the explicit manual escape (`rm .site/ship.requested`).
 *
 * Contract it reads (under the project's `.site/`):
 *   reports/summary.md   must contain `STATUS: PASS`
 *   review/<name>.md     each must contain `VERDICT: PASS` (any `VERDICT: BLOCK` fails)
 *   ship.requested       presence = a ship is pending
 *   done.md              presence = already shipped (no-op)
 *
 * Exit codes: 0 = allow stop; 2 = block and force continue.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const MAX_BLOCKS = 5;
const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const siteDir = join(projectDir, ".site");
const counterFile = join(siteDir, ".dod-block-count");

// Best-effort read of the hook payload (not required for the decision).
try {
  JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  /* stdin optional */
}

function allow() {
  try {
    if (existsSync(counterFile)) rmSync(counterFile);
  } catch {}
  process.exit(0);
}

function readCount() {
  try {
    return parseInt(readFileSync(counterFile, "utf8"), 10) || 0;
  } catch {
    return 0;
  }
}

function block(reasons) {
  const count = readCount() + 1;
  try {
    writeFileSync(counterFile, String(count));
  } catch {}

  if (count > MAX_BLOCKS) {
    console.error(
      `[site-builder] DoD gate: ${count - 1} blocks with no resolution — releasing to avoid trapping the session.\n` +
        `The Definition of Done is STILL NOT MET. Do not represent this site as done. Report the red items to the user.`,
    );
    try {
      rmSync(counterFile);
    } catch {}
    process.exit(0);
  }

  const body = [
    "Definition of Done not met — a ship is pending but quality gates are red.",
    "Fix these, re-run `/site-builder:verify` and `/site-builder:review`, then ship again:",
    "",
    ...reasons.map((r) => `  ✗ ${r}`),
    "",
    `(DoD Stop hook, block ${count}/${MAX_BLOCKS}. To abandon this ship instead of fixing, delete .site/ship.requested. Never claim the site is done while these fail.)`,
  ].join("\n");
  console.error(body);
  process.exit(2);
}

// Not a site project, or no ship pending → never block.
if (!existsSync(siteDir)) allow();
if (existsSync(join(siteDir, "done.md"))) allow();
if (!existsSync(join(siteDir, "ship.requested"))) allow();

const reasons = [];

const summaryPath = join(siteDir, "reports", "summary.md");
if (!existsSync(summaryPath)) {
  reasons.push("no gate report — run `/site-builder:verify` (expected .site/reports/summary.md)");
} else {
  const summary = readFileSync(summaryPath, "utf8");
  if (!/^STATUS:\s*PASS\s*$/m.test(summary)) {
    const fails = summary
      .split("\n")
      .filter((l) => /\b(FAIL|✗)\b/.test(l))
      .map((l) => l.trim());
    reasons.push("gate summary is not STATUS: PASS");
    for (const f of fails.slice(0, 12)) reasons.push(`gate: ${f}`);
  }
}

const reviewDir = join(siteDir, "review");
if (existsSync(reviewDir)) {
  for (const file of readdirSync(reviewDir)) {
    if (!file.endsWith(".md")) continue;
    const text = readFileSync(join(reviewDir, file), "utf8");
    if (/^VERDICT:\s*BLOCK\s*$/m.test(text)) reasons.push(`reviewer blocked: ${file}`);
    else if (!/^VERDICT:\s*PASS\s*$/m.test(text)) reasons.push(`reviewer inconclusive: ${file}`);
  }
} else {
  reasons.push("no judgment reviews — run `/site-builder:review` (expected .site/review/*.md)");
}

if (reasons.length > 0) block(reasons);
allow();
