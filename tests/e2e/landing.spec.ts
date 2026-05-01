import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads and shows key content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/DoctorKhuji/i);
    await expect(page.getByRole("heading", { name: "Your Health, Our Priority" })).toBeVisible();
    await expect(page.getByRole("link", { name: /get started/i }).first()).toBeVisible();
  });

  test("navbar has sign in and get started links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /sign in/i }).first()).toHaveAttribute("href", "/login");
    await expect(page.getByRole("link", { name: /get started/i }).first()).toHaveAttribute("href", "/register");
  });

  test("features section is visible", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /features/i }).first().click();
    await expect(page.getByRole("heading", { name: "Easy Scheduling" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Verified Doctors" })).toBeVisible();
  });

  test("how it works section shows 3 steps", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("01", { exact: true })).toBeVisible();
    await expect(page.getByText("02", { exact: true })).toBeVisible();
    await expect(page.getByText("03", { exact: true })).toBeVisible();
  });

  test("CTA buttons navigate to register", async ({ page }) => {
    await page.goto("/");
    const joinBtn = page.getByRole("link", { name: /join as patient/i });
    await expect(joinBtn).toHaveAttribute("href", "/register");
  });

  test("mobile menu toggles on small screen", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const menuBtn = page.getByRole("button", { name: /toggle menu/i });
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(page.getByRole("link", { name: /features/i })).toBeVisible();
    await menuBtn.click();
    await expect(page.getByRole("link", { name: /features/i })).toBeHidden();
  });
});
