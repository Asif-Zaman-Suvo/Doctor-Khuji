import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

test.describe("Login", () => {
  test("renders login form with all fields", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page.locator("[data-testid='login-form']")).toBeVisible();
    await expect(page.locator("[data-testid='login-email']")).toBeVisible();
    await expect(page.locator("[data-testid='login-password']")).toBeVisible();
    await expect(page.locator("[data-testid='login-submit']")).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("notauser@fake.com", "WrongPass123!");
    await loginPage.expectError();
  });

  test("shows validation error for empty email", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.locator("[data-testid='login-submit']").click();
    await expect(page.getByText(/invalid email|required/i).first()).toBeVisible();
  });

  test("has link to register page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("link", { name: /create one|register/i })).toHaveAttribute("href", "/register");
  });
});

test.describe("Register", () => {
  test("renders register form with role selector", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await expect(page.locator("[data-testid='register-form']")).toBeVisible();
    await expect(page.locator("[data-testid='role-patient']")).toBeVisible();
    await expect(page.locator("[data-testid='role-doctor']")).toBeVisible();
  });

  test("can select patient role", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.selectRole("patient");
    await expect(page.locator("[data-testid='role-patient']")).toHaveClass(/border-\[#24AE7C\]/);
  });

  test("can select doctor role", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.selectRole("doctor");
    await expect(page.locator("[data-testid='role-doctor']")).toHaveClass(/border-\[#24AE7C\]/);
  });

  test("shows error for mismatched passwords", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.selectRole("patient");
    await registerPage.fill("Test User", "test@example.com", "Password1!", "Different1!");
    await registerPage.submit();
    await expect(page.getByText(/match/i)).toBeVisible();
  });

  test("shows error for short password", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.selectRole("patient");
    await registerPage.fill("Test User", "test@example.com", "short", "short");
    await registerPage.submit();
    await expect(page.getByText(/8 characters/i)).toBeVisible();
  });

  test("has link back to login", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });
});
