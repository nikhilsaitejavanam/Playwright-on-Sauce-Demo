import { type FullConfig } from "@playwright/test";
import { logger } from "../helpers/logger";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default async function globalTeardown(config: FullConfig) {
  // Generate allure-report from allure-results
  try {
    await execAsync("allure generate allure-results --clean -o allure-report");
    logger.info("Allure report generated successfully.");
  } catch (error: any) {
    logger.error(`Failed to generate allure report: ${error.message}`);
  }
  logger.info("Global teardown completed.");
}
