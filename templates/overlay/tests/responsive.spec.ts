import { test, expect } from "@playwright/test";

// responsive-gate: the site must hold up across the viewport matrix.
// Hard fails: horizontal overflow at any width; tap targets below the WCAG 2.5.8 AA floor (24px).
const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 720 }, // smallest supported / reflow baseline
  { name: "mobile-375", width: 375, height: 812 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "wide-1920", width: 1920, height: 1080 },
];

for (const vp of VIEWPORTS) {
  test(`no horizontal overflow @ ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow of ${overflow}px at ${vp.width}px`).toBeLessThanOrEqual(1);
  });
}

test("tap targets meet WCAG 2.5.8 AA (>=24px) on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const tooSmall = await page.$$eval("a, button, [role=button], input, select", (els) =>
    els
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24);
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName.toLowerCase(), text: (el.textContent || "").trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) };
      }),
  );
  expect(tooSmall, JSON.stringify(tooSmall, null, 2)).toEqual([]);
});
