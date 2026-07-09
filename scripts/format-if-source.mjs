#!/usr/bin/env node
/**
 * PostToolUse(Write|Edit) — keep the tree clean without prompting.
 *
 * Reads the hook payload from stdin, and if the edited file is formattable source
 * inside a project that has a local formatter, runs it on just that file. Best-effort
 * and silent: it never blocks (always exits 0) and swallows errors so a missing
 * formatter or a non-source edit is a no-op.
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname } from "node:path";

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

let filePath;
try {
  const data = JSON.parse(readStdin() || "{}");
  filePath =
    data?.tool_input?.file_path ||
    data?.toolInput?.file_path ||
    data?.context?.file_path;
} catch {
  process.exit(0);
}

const FORMATTABLE = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".json", ".md"]);

if (!filePath || !FORMATTABLE.has(extname(filePath)) || !existsSync(filePath)) {
  process.exit(0);
}

try {
  // Only if a local prettier is resolvable; ignore anything that goes wrong.
  execSync(`npx --no-install prettier --write "${filePath}"`, {
    stdio: "ignore",
    timeout: 60_000,
  });
} catch {
  // no formatter / not applicable — silent no-op
}
process.exit(0);
