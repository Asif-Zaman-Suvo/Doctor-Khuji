import { Page, expect } from "@playwright/test";

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/register");
    await this.page.waitForSelector("[data-testid='register-form']");
  }

  async selectRole(role: "patient" | "doctor") {
    await this.page.locator(`[data-testid='role-${role}']`).click();
  }

  async fill(name: string, email: string, password: string, confirm: string) {
    await this.page.locator("[data-testid='register-name']").fill(name);
    await this.page.locator("[data-testid='register-email']").fill(email);
    await this.page.locator("[data-testid='register-password']").fill(password);
    await this.page.locator("[data-testid='register-confirm-password']").fill(confirm);
  }

  async submit() {
    await this.page.locator("[data-testid='register-submit']").click();
  }

  async expectError() {
    await expect(this.page.locator("[data-testid='register-error']")).toBeVisible();
  }
}
