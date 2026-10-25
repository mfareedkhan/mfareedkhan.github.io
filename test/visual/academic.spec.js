const { test, expect } = require("@playwright/test");
const { preparePage, stabilizeVisuals } = require("./helpers");

const routes = [
  { path: "/", heading: "Research Highlights" },
  { path: "/research/", heading: "Research Areas" },
  { path: "/publications/", heading: "Publications" },
  { path: "/projects/", heading: "Projects" },
  { path: "/cv/", heading: "Curriculum Vitae" },
  { path: "/contact/", heading: "Contact" },
];

for (const route of routes) {
  for (const theme of ["light", "dark"]) {
    test(`academic page renders: ${route.path} (${theme})`, async ({ page }) => {
      await preparePage(page, theme);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(`/al-folio${route.path}`, { waitUntil: "networkidle" });
      expect(response.status()).toBe(200);
      await stabilizeVisuals(page);
      await expect(page.getByRole("heading", { name: route.heading, exact: true }).first()).toBeVisible();
      await expect(page.locator(".mf-wrap")).toBeVisible();
      expect(errors).toEqual([]);
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(horizontalOverflow).toBeLessThanOrEqual(2);
    });
  }
}

test("publication statuses and links are accurate", async ({ page }) => {
  await page.goto("/al-folio/publications/");
  await expect(page.getByText("Accepted · 2026", { exact: true })).toBeVisible();
  await expect(page.getByText("Published · 2025", { exact: true })).toBeVisible();
  await expect(page.getByText("Submitted · With editor", { exact: true })).toBeVisible();
  await expect(page.getByText("Revision / Preparation", { exact: true })).toBeVisible();
  await expect(page.locator('a[href*="10.5281/zenodo.23286489"]')).toHaveCount(1);
});

test("homepage uses academic highlights, not outdated metrics", async ({ page }) => {
  await page.goto("/al-folio/");
  await expect(page.getByText("CXRG-SVLM", { exact: true })).toBeVisible();
  await expect(page.getByText(/1.91%/).first()).toBeVisible();
  await expect(page.getByText(/0.97%/)).toHaveCount(0);
  await expect(page.locator(".mf-showcase .mf-card")).toHaveCount(2);
});
