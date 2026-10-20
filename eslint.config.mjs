import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      "node_modules/**",
      "allure-results/**",
      "allure-report/**",
      "playwright-report/**",
      "test-results/**",
      "blob-report/**",
      "playwright/.auth/**",
    ],
  },
  {
    files: ["**/*.ts"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
  },
]);