#!/usr/bin/env node
/**
 * semantics-gate: validate the rendered HTML of the running site.
 * Requires the server up (`next start`) on :3000. Exits 1 on invalid markup.
 */
import { HtmlValidate } from "html-validate";

const url = process.env.SITE_URL ?? "http://localhost:3000/";

const res = await fetch(url).catch(() => null);
if (!res || !res.ok) {
  console.error(`semantics-gate: could not fetch ${url} — is the server running?`);
  process.exit(1);
}
const html = await res.text();

const hv = new HtmlValidate({
  extends: ["html-validate:recommended"],
  rules: {
    "heading-level": "error",
    "no-missing-references": "error",
  },
});

const report = await hv.validateString(html);
if (report.valid) {
  console.log("semantics-gate: PASS");
  process.exit(0);
}
for (const result of report.results) {
  for (const m of result.messages) {
    console.error(`  ${m.severity === 2 ? "✗" : "!"} [${m.ruleId}] ${m.message} (${m.line}:${m.column})`);
  }
}
console.error("semantics-gate: FAIL");
process.exit(1);
