import { Page, expect } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/login");
    await this.page.waitForSelector("[data-testid='login-form']");
  }

  async login(email: string, password: string) {
    await this.page.locator("[data-testid='login-email']").fill(email);
    await this.page.locator("[data-testid='login-password']").fill(password);
    await this.page.locator("[data-testid='login-submit']").click();
  }

  async expectError() {
    await expect(this.page.locator("[data-testid='login-error']")).toBeVisible();
  }

  async expectRedirectTo(urlPattern: RegExp) {
    await this.page.waitForURL(urlPattern);
  }
}
