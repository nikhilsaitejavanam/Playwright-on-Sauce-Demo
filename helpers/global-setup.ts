import { logger } from "../helpers/logger";

import { rimrafSync } from "rimraf";
import path from "path";

import { LoginPage } from "../pages/login-page";
import { ENV_CONFIG } from "../config/environment";

import { chromium, expect } from "@playwright/test";

export default async function globalSetup() {
  logger.info("Global setup started.");

  // Clear or delete allure-results folder
  const allureResultsPath = path.resolve(__dirname, "../allure-results");
  const allureReportPath = path.resolve(__dirname, "../allure-report");

  rimrafSync(allureResultsPath);
  rimrafSync(allureReportPath);

  // creating storage state for login
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);
  await page.goto(ENV_CONFIG.BASE_URL);
  await loginPage.login(ENV_CONFIG.SAUCE_USERNAME, ENV_CONFIG.SAUCE_PASSWORD);

  await expect(page).toHaveURL(/\/inventory\.html/);

  await page
    .context()
    .storageState({
      path: path.resolve(__dirname, "../helpers/storage-state.json"),
    });
  await browser.close();
}
