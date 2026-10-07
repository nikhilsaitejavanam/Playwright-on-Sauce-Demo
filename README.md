# Playwright on Sauce Demo

This repository contains a small Playwright test automation project for the Sauce Demo application at `https://www.saucedemo.com/`.

The project uses:

- Playwright Test for browser automation and assertions
- TypeScript for page objects, tests, and config
- `dotenv` for environment-based configuration
- `winston` for console logging during test execution

# Playwright on Sauce Demo

Playwright automation framework for the Sauce Demo application using TypeScript, Page Object Model, HTML reporting, and Allure reporting.

## Overview

This project automates core Sauce Demo user flows:

- Login validation
- Dashboard product sorting and menu interactions
- Cart validation and cart badge behavior
- Checkout flow validation
- PDF download and PDF content verification after order completion

The suite is organized with page objects under `pages/`, shared utilities under `helpers/`, and Playwright specs under `tests/`.

## Tech Stack

- Playwright Test
- TypeScript
- `allure-playwright` for raw Allure results
- `allure-commandline` for generating the HTML Allure report
- `dotenv` for environment-specific config
- `winston` for test execution logs
- `pdf-parse` for validating generated PDF content

## Project Structure

```text
.
├─ .github/
│  ├─ agents/
│  │  ├─ playwright-test-generator.agent.md
│  │  ├─ playwright-test-healer.agent.md
│  │  └─ playwright-test-planner.agent.md
│  └─ workflows/
│     └─ playwright.yml
├─ .vscode/
│  └─ mcp.json
├─ config/
│  └─ environment.ts
├─ helpers/
│  ├─ global-setup.ts
│  ├─ global-teardown.ts
│  └─ logger.ts
├─ pages/
│  ├─ cart-page.ts
│  ├─ checkout-page.ts
│  ├─ dashboard-page.ts
│  └─ login-page.ts
├─ tests/
│  ├─ cart-page.spec.ts
│  ├─ checkout-page.spec.ts
│  ├─ dashboard-page.spec.ts
│  └─ login-page.spec.ts
├─ package.json
├─ playwright.config.ts
└─ README.md
```

Generated directories such as `playwright-report/`, `test-results/`, `allure-results/`, and `allure-report/` can exist locally after test execution, but they are not source files.

## Prerequisites

- Node.js 20+
- npm

## Installation

Install dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install
```

For CI-style Linux setup, the workflow uses:

```bash
npx playwright install --with-deps
```

## Environment Configuration

Runtime configuration is loaded from `config/environment.ts`.

The selected file is based on the `ENV` variable:

- `ENV=dev` loads `.env.dev`
- `ENV=qa` loads `.env.qa`
- `ENV=uat` loads `.env.uat`

Example template from `.env.example`:

```env
ENV="dev"
SAUCE_URL="https://www.saucedemo.com/"
SAUCE_USERNAME="standard_user"
SAUCE_PASSWORD="secret_sauce"
CI=false
```

Notes:

- `.env.*` files are gitignored.
- `BASE_URL`, credentials, and the CI flag are exposed through `ENV_CONFIG`.

## Running Tests

Available npm scripts:

```bash
npm run dev
npm run qa
npm run uat
```

What they do:

- `npm run dev`: headed local run with `ENV=dev`
- `npm run qa`: full suite with `ENV=qa`
- `npm run uat`: smoke suite only with `ENV=uat`

Useful direct Playwright commands:

```bash
npx playwright test
npx playwright test tests/login-page.spec.ts
npx playwright test tests/checkout-page.spec.ts --grep "PDF related"
npx playwright test --grep @smoke
npx playwright test --grep @edge
npx playwright show-report
```

PowerShell example:

```powershell
$env:ENV = "dev"
npx playwright test
```

## Playwright Configuration

Current configuration in `playwright.config.ts`:

- Test directory: `tests/`
- Browser project enabled: `chromium`
- `fullyParallel: true`
- `forbidOnly` enabled on CI
- `retries: 1` on CI, `0` locally
- `workers: 6` on CI
- `trace: retain-on-first-failure`
- `screenshot: on-first-failure`
- Reporters:
	- Playwright HTML reporter
	- Allure reporter with `allure-results/`

The suite also uses:

- `globalSetup` to clear previous Allure outputs
- `globalTeardown` to generate `allure-report/` from `allure-results/`

## Test Coverage

### Login

`tests/login-page.spec.ts` covers:

- Login page visibility
- Successful login
- Invalid login
- Empty credential validation

### Dashboard

`tests/dashboard-page.spec.ts` covers:

- Dashboard landing validation
- Product sorting by name and price
- Menu open and close behavior
- Dynamic catalog flows: Lazy Load, Spinner, Slider
- About navigation
- Logout
- Reset app state
- Cart badge increments and decrements

### Cart

`tests/cart-page.spec.ts` covers:

- Navigation to cart and back to inventory
- Cart badge count
- Added items visibility
- Price consistency between dashboard and cart
- Item removal behavior

### Checkout

`tests/checkout-page.spec.ts` covers:

- Checkout navigation flow
- Required field validations
- Overview totals and order confirmation
- PDF download validation
- PDF text verification with `pdf-parse`

## Page Objects

### `pages/login-page.ts`

- Login form interactions
- Login error handling
- Title visibility assertion

### `pages/dashboard-page.ts`

- Product listing and pricing helpers
- Product sorting
- Menu interactions
- Dynamic catalog validation
- Add to cart, remove from cart, and cart navigation

### `pages/cart-page.ts`

- Cart content validation
- Price lookup in cart
- Remove item actions
- Continue shopping and checkout navigation

### `pages/checkout-page.ts`

- Checkout form interactions
- Validation error handling
- Overview totals
- Finish page assertions
- PDF generation action

## Reporting

Two report formats are produced:

### Playwright HTML Report

Open locally with:

```bash
npx playwright show-report
```

### Allure Report

Raw results are written to `allure-results/`.

HTML output is generated into `allure-report/` during global teardown.

Open locally with:

```bash
npm run allure:open
```

## CI Workflow

GitHub Actions workflow: `.github/workflows/playwright.yml`

It runs on:

- Push to `main`
- Push to `qa`
- Pull requests targeting `main` or `qa`
- Manual dispatch

Workflow behavior:

- Installs dependencies
- Installs Playwright browsers and Linux dependencies
- Chooses runtime environment from the target branch
- Runs `npm run qa` for the `qa` branch
- Runs `npm run uat` for the `main` branch
- Uploads these artifacts:
	- `playwright-report`
	- `allure-results`
	- `allure-report`

Branch mapping:

- `qa` branch uses QA variables and credentials
- `main` branch uses UAT variables and credentials

## Logging

`helpers/logger.ts` provides shared Winston console logging with timestamps and log levels. File logging is present in commented form and is not currently enabled.

## Editor Integration

`.vscode/mcp.json` registers a Playwright MCP server using:

```json
{
	"command": "npx",
	"args": ["playwright", "run-test-mcp-server"]
}
```

The repository also includes custom GitHub Copilot agent definitions under `.github/agents/` for test planning, generation, and healing workflows.

## Notes

- Generated report folders are ignored by Git.
- The project is configured as `commonjs` in `package.json`.
- The checkout PDF assertions use parsed PDF text, which can differ slightly from on-screen text formatting.
## Suggested next cleanup steps
