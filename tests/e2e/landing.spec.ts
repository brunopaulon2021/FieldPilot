import { expect, test } from "@playwright/test";

test("presents the FieldPilot value proposition and working navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/FieldPilot/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("relatório final");
  await page.getByRole("link", { name: "Começar agora" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("heading", { name: "Crie a sua conta." })).toBeVisible();
});

test("offers complete public authentication entry points", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Palavra-passe")).toBeVisible();
  await page.getByRole("link", { name: "Esqueci-me da palavra-passe" }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await expect(page.getByRole("button", { name: "Enviar instruções" })).toBeVisible();
});

test("redirects protected routes when authentication is not configured", async ({ page }) => {
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login\?error=configuration$/);
  await expect(page.getByRole("alert")).toContainText("autenticação ainda está a ser configurada");
});

test("protects the customer workspace when authentication is not configured", async ({ page }) => {
  await page.goto("/app/customers");
  await expect(page).toHaveURL(/\/login\?error=configuration$/);
  await expect(page.getByRole("alert")).toContainText("autenticação ainda está a ser configurada");
});

test("health endpoint is available", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ status: "ok", service: "fieldpilot-web" });
});
