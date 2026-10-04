import { type FullConfig } from "@playwright/test";
import { logger } from "../helpers/logger";

import { rimrafSync } from "rimraf";
import path from "path";

export default async function globalSetup(config: FullConfig) {
  logger.info("Global setup started.");

  // Clear or delete allure-results folder
  const allureResultsPath = path.resolve(__dirname, "../allure-results");
  const allureReportPath = path.resolve(__dirname, "../allure-report");

  rimrafSync(allureResultsPath);
  rimrafSync(allureReportPath);
}
