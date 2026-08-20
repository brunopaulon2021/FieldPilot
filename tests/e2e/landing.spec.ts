import { expect, test } from "@playwright/test";

test("presents the FieldPilot value proposition and working navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/FieldPilot/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("relatório final");
  await page.getByRole("link", { name: "Conhecer o FieldPilot" }).click();
  await expect(page.locator("#produto")).toBeInViewport();
});

test("health endpoint is available", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ status: "ok", service: "fieldpilot-web" });
});
