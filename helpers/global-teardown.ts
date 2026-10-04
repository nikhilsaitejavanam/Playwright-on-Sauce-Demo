import { type FullConfig } from "@playwright/test";
import { logger } from "../helpers/logger";
import { exec } from "child_process";

export default async function globalTeardown(config: FullConfig) {
  // Generate allure-report from allure-results
  exec("allure generate allure-results --clean -o allure-report", (error) => {
    if (error) {
      logger.error(`Failed to generate allure report: ${error.message}`);
    }
  });
  logger.info("Global teardown completed.");
}
