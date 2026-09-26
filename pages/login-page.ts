import { expect, Page, Locator } from "@playwright/test";
import { logger } from "../helpers/logger";

export class LoginPage {
  private readonly titleText: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginBtn: Locator;
  private readonly loginError: Locator;

  constructor(private readonly page: Page) {
    this.titleText = this.page.locator("div.login_logo");
    this.usernameInput = this.page.getByRole("textbox", { name: "Username" });
    this.passwordInput = this.page.getByLabel("Password");
    this.loginBtn = this.page.locator('#login-button');
    this.loginError = this.page.getByRole("alert");
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginBtn.click();
  }

  async errorStatus(): Promise<{ status: boolean; errorMessage: string }> {
    const errorStatus = await this.loginError.isVisible();
    let errorMessage: string | null = '';
    if(errorStatus){
      errorMessage = await this.loginError.textContent();
      logger.warn(`Login error message: ${errorMessage}`);
    }
    return { status: errorStatus ? false : true, errorMessage: errorMessage || '' };
  }

  async login(username: string, password: string): Promise<{ status: boolean; errorMessage: string }> {
    logger.info(`Logging in with username: ${username} and password: ${password}`);
    await expect(this.titleText).toBeVisible();
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
    const {status, errorMessage} = await this.errorStatus();
    return { status, errorMessage };
  }
}
