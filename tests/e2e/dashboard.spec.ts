import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@portal.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@1234";

test.describe("Dashboard auth guard", () => {
  test("redirects unauthenticated user from /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects /dashboard/admin without auth", async ({ page }) => {
    await page.goto("/dashboard/admin");
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects /dashboard/patient without auth", async ({ page }) => {
    await page.goto("/dashboard/patient");
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects /dashboard/doctor without auth", async ({ page }) => {
    await page.goto("/dashboard/doctor");
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Admin dashboard", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    await page.waitForURL(/\/dashboard\/admin/);
  });

  test("shows admin dashboard after login", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/admin/);
  });

  test("sidebar has navigation links", async ({ page }) => {
    await expect(page.getByRole("link", { name: /overview/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /doctors/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /users/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /appointments/i })).toBeVisible();
  });

  test("can navigate to doctors management page", async ({ page }) => {
    await page.getByRole("link", { name: "Doctors" }).click();
    await page.waitForURL(/\/dashboard\/admin\/doctors/);
    await expect(page.getByRole("heading", { name: /doctor management/i })).toBeVisible();
  });

  test("can navigate to users management page", async ({ page }) => {
    await page.getByRole("link", { name: "Users" }).click();
    await page.waitForURL(/\/dashboard\/admin\/users/);
    await expect(page.getByRole("heading", { name: /user management/i })).toBeVisible();
  });

  test("sign out button redirects to login", async ({ page }) => {
    await page.locator("[data-testid='sidebar-signout']").click();
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });
});
