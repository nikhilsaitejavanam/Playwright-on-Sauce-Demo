import dotenv from "dotenv";
import path from "path";

const env = process.env.ENV || "dev";

const envPath = path.resolve(__dirname, `../.env.${env}`);
dotenv.config({ path: envPath });

const requiredVariables = ["SAUCE_URL", "SAUCE_USERNAME", "SAUCE_PASSWORD"];
for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable} in ${env}`);
  }
}

export const ENV_CONFIG = {
  ENV: env,
  BASE_URL: process.env.SAUCE_URL!,
  SAUCE_USERNAME: process.env.SAUCE_USERNAME!,
  SAUCE_PASSWORD: process.env.SAUCE_PASSWORD!,
  CI: process.env.CI === "true",
};
