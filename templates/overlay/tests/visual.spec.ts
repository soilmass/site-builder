import { test, expect } from "@playwright/test";

// visual-regression-gate: pixel-diff the home page against the committed baseline.
// Update baselines intentionally with `playwright test --update-snapshots`.
test("home: matches visual baseline", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("home.png", {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});
