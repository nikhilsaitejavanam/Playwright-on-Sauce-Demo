import { logger } from "../helpers/logger";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default async function globalTeardown() {
  // Generate allure-report from allure-results
  try {
    await execAsync("allure generate allure-results --clean -o allure-report");
    logger.info("Allure report generated successfully");
  } catch (error) {
    logger.error(`Failed to generate allure report: ${error}`);
  }
  logger.info("Global teardown completed");
}
