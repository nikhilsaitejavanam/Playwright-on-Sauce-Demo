import { expect, Page, Locator } from "@playwright/test";
import { logger } from "../helpers/logger";

export class LoginPage {
  // Title text locator
  private readonly titleText: Locator;

  // Input fields locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginBtn: Locator;

  // Error message locator
  private readonly loginError: Locator;

  constructor(private readonly page: Page) {
    // Title text locator
    this.titleText = this.page.locator("div.login_logo");

    // Input fields locators
    this.usernameInput = this.page.getByRole("textbox", { name: "Username" });
    this.passwordInput = this.page.getByLabel("Password");
    this.loginBtn = this.page.locator("#login-button");

    // Error message locator
    this.loginError = this.page.getByRole("alert");
  }

  /**
   * Fills in the username input field with the provided username.
   * @param username
   */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Fills in the password input field with the provided password.
   * @param password
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Clicks the login button.
   */
  async clickLoginButton(): Promise<void> {
    await this.loginBtn.click();
  }

  /**
   * Checks the error status and retrieves the error message if present.
   * @returns An object containing the status and error message.
   */
  async errorStatus(): Promise<{ status: boolean; errorMessage: string }> {
    const errorStatus = await this.loginError.isVisible();
    let errorMessage: string | null = "";
    if (errorStatus) {
      errorMessage = await this.loginError.textContent();
      logger.warn(`Login error message: ${errorMessage}`);
    }
    return {
      status: errorStatus ? false : true,
      errorMessage: errorMessage || "",
    };
  }

  /**
   * Performs the login action by filling in the username and password fields and clicking the login button.
   * @param username The username to use for login.
   * @param password The password to use for login.
   * @returns An object containing the status and error message after attempting to log in.
   */
  async login(
    username: string,
    password: string,
  ): Promise<{ status: boolean; errorMessage: string }> {
    logger.info(
      `Logging in with username: ${username} and password: ${password}`,
    );
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
    const { status, errorMessage } = await this.errorStatus();
    return { status, errorMessage };
  }

  async checkTitleVisibility(): Promise<void> {
    await expect(this.titleText).toBeVisible();
    logger.info(`Login page title is visible.`);
  }
}
