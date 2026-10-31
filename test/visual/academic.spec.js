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

test("publication sections and simplified paper links are accurate", async ({ page }) => {
  await page.goto("/al-folio/publications/");
  await expect(page.getByRole("heading", { name: "Published Research" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Submitted", exact: true })).toBeVisible();
  await expect(page.locator("#published .mf-publication")).toHaveCount(2);
  await expect(page.locator("#published .mf-actions .mf-btn")).toHaveCount(2);
  await expect(page.locator("#published .mf-actions .mf-btn").first()).toHaveText("Read paper");
  await expect(page.locator('a[href*="s41598-026-77203-3"]')).toHaveCount(2);
  await expect(page.locator(".mf-publication .mf-pill")).toHaveCount(0);
  await expect(page.getByText("Zenodo artifact", { exact: true })).toHaveCount(0);
});

test("projects shows only three distinct AI engineering projects", async ({ page }) => {
  await page.goto("/al-folio/projects/");
  await expect(page.locator(".mf-project-grid .mf-project")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Roman Urdu Conversational Model" })).toBeVisible();
});
test("shared footer has the exact MS Data Science copyright", async ({ page }) => {
  await page.goto("/al-folio/");
  const footer = page.locator("footer");
  await expect(footer).toContainText("Copyright 2026 Muhammad Fareed, MS Data Science");
  await expect(footer).not.toContainText("Research portfolio built with Jekyll");
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
