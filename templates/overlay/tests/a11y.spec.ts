import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// a11y-gate: no serious/critical WCAG 2.2 AA violations. Automated coverage only —
// the a11y-manual-reviewer subagent covers the ~60% axe cannot catch.
test("home: no serious/critical axe violations (WCAG 2.2 AA)", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  const blocking = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );

  expect(
    blocking,
    JSON.stringify(
      blocking.map((v) => ({ id: v.id, impact: v.impact, help: v.help })),
      null,
      2,
    ),
  ).toEqual([]);
});
