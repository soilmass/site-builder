#!/usr/bin/env node
/**
 * semantics-gate: validate the rendered HTML of the running site for real structural and
 * accessibility defects — NOT JSX serialization style. Frameworks (Next/React) emit
 * self-closing void elements, camelCase attrs (charSet/fetchPriority), and generated ids;
 * those are valid output, so the stylistic rules that flag them are disabled here.
 * Requires the server up (`next start`) on :3000. Exits 1 on real issues.
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
  extends: ["html-validate:standard"],
  rules: {
    // Stylistic rules that fight framework-serialized HTML — not real defects:
    "void-style": "off",
    "attribute-boolean-style": "off",
    "attribute-empty-style": "off",
    "attr-case": "off",
    "valid-id": "off", // React generates ids like "_R_"
    "no-implicit-button-type": "off",
    "prefer-native-element": "off",
    // Real structural / accessibility checks we DO enforce:
    "heading-level": "error",
    "no-missing-references": "error",
    "element-required-attributes": "error",
    "no-dup-id": "error",
    "no-dup-attr": "error",
    "element-permitted-content": "error",
    "wcag/h37": "error", // <img> requires alt
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
