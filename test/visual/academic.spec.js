const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
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
      if (theme === "light") {
        const output = path.join(process.cwd(), "preview-screenshots");
        fs.mkdirSync(output, { recursive: true });
        const slug = route.path === "/" ? "home" : route.path.replaceAll("/", "");
        await page.screenshot({ path: path.join(output, `${test.info().project.name}-${slug}.png`), fullPage: true, animations: "disabled" });
      }
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
  await expect(page.getByRole("heading", { name: "CXRG-SVLM", exact: true })).toBeVisible();
  await expect(page.getByText(/1.91%/).first()).toBeVisible();
  await expect(page.getByText(/0.97%/)).toHaveCount(0);
  await expect(page.locator(".mf-showcase .mf-card")).toHaveCount(2);
});

test("home presents researcher name and profile image", async ({ page }) => {
  await page.goto("/al-folio/");
  await expect(page.getByRole("heading", { level: 1, name: "Muhammad Fareed" })).toBeVisible();
  const portrait = page.locator('img[src*="prof_pic"]').first();
  await expect(portrait).toBeVisible();
  expect(await portrait.evaluate((img) => img.complete && img.naturalWidth > 0)).toBeTruthy();
});

test("CV PDF link points to the uploaded downloadable file", async ({ page, request }) => {
  await page.goto("/al-folio/cv/");
  const cvLink = page.getByRole("link", { name: /Download CV \(PDF\)/ });
  await expect(cvLink).toBeVisible();
  const href = await cvLink.getAttribute("href");
  expect(href).toContain("/assets/pdf/muhammad_fareed_cv.pdf");
  const response = await request.get(href);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/pdf|octet-stream/);
  const buf = await response.body();
  expect(buf.subarray(0, 4).toString()).toBe("%PDF");
});
