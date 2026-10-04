# Playwright on Sauce Demo

This repository contains a small Playwright test automation project for the Sauce Demo application at `https://www.saucedemo.com/`.

The project uses:

- Playwright Test for browser automation and assertions
- TypeScript for page objects, tests, and config
- `dotenv` for environment-based configuration
- `winston` for console logging during test execution

## What this project does

The current test suite focuses on two areas of the Sauce Demo site:

- Login validation
- Product sorting on the dashboard page

The suite uses a page object model with separate page classes for the login page and dashboard page.

## Current repository layout

```text
.
├─ .env.example
├─ .gitignore
├─ package.json
├─ package-lock.json
├─ playwright.config.ts
├─ README.md
├─ config/
│  └─ environment.ts
├─ helpers/
│  └─ logger.ts
├─ pages/
│  ├─ dashboard-page.ts
│  └─ login-page.ts
├─ tests/
│  ├─ dashboard-page.spec.ts
│  ├─ login-page.spec.ts
│  └─ seed.spec.ts
├─ specs/
│  └─ README.md
├─ .github/
│  ├─ agents/
│  │  ├─ playwright-test-generator.agent.md
│  │  ├─ playwright-test-healer.agent.md
│  │  └─ playwright-test-planner.agent.md
│  └─ workflows/
│     ├─ copilot-setup-steps.yml
│     └─ playwright.yml
├─ .vscode/
│  └─ mcp.json
├─ playwright-report/
│  └─ index.html
└─ test-results/
	 └─ .last-run.json
```

## Setup

### Prerequisites

- Node.js 20 or newer
- npm

This project currently uses `@playwright/test@1.63.0`, and the lockfile indicates a Node.js 20+ runtime expectation.

### Install dependencies

```bash
npm ci
```

### Install Playwright browsers

```bash
npx playwright install
```

## Environment configuration

Environment values are loaded by `config/environment.ts` from a file named `.env.<ENV>`.

Example:

- If `ENV=dev`, the project loads `.env.dev`
- If `ENV=qa`, the project loads `.env.qa`

There is an example file in the repo:

```env
ENV_NAME="example"
SAUCE_URL=https://www.saucedemo.com/
SAUCE_USERNAME="standard_user"
SAUCE_PASSWORD="secret_sauce"
```

Recommended local setup:

1. Copy `.env.example` to `.env.dev`
2. Update values if needed
3. Run tests with `ENV=dev`

On Windows PowerShell:

```powershell
$env:ENV = "dev"
npx playwright test
```

Cross-platform alternative:

```bash
npx cross-env ENV=dev playwright test
```

## How tests run

The Playwright configuration in `playwright.config.ts` is set up as follows:

- Tests are read from `./tests`
- Browser project enabled: `chromium`
- Reporter: `html`
- Retries: `2` on CI, `0` locally
- Workers: single worker on CI, default locally
- Base URL comes from `ENV_CONFIG.BASE_URL`
- Trace collection is currently disabled

## Test coverage in this repo

### Login tests

`tests/login-page.spec.ts` covers:

- Successful login with valid credentials
- Login failure with invalid credentials
- Login failure with empty credentials

### Dashboard tests

`tests/dashboard-page.spec.ts` covers:

- Sort products by name ascending
- Sort products by name descending
- Sort products by price ascending
- Sort products by price descending

### Seed file

`tests/seed.spec.ts` is a placeholder file with an empty sample test and is not currently implementing a real scenario.

## Page objects

### `pages/login-page.ts`

Implements the login page object using Playwright locators and helper methods:

- Fill username
- Fill password
- Click login
- Read login error state
- Execute the full login flow

### `pages/dashboard-page.ts`

Implements the dashboard page object for product interactions:

- Read all product names
- Read all product prices
- Apply the product sort filter
- Access product-specific locators by name

This file also contains a large commented legacy implementation. It is not active code, but it remains in the file as historical or in-progress content.

## Logging

`helpers/logger.ts` defines a shared Winston logger.

Current behavior:

- Logs are written to the console
- Log level is `info`
- File logging exists in commented form but is not enabled

## CI and automation files

### GitHub Actions

`.github/workflows/playwright.yml`:

- Runs on pushes and pull requests to `main` and `master`
- Installs dependencies
- Installs Playwright browsers
- Runs the Playwright suite
- Uploads the HTML report as an artifact

`.github/workflows/copilot-setup-steps.yml`:

- Installs dependencies and Playwright browsers
- Includes a placeholder build step: `npx run build`

That build command is likely not valid for this repository in its current state because there is no build script in `package.json`.

### Copilot agent files

The `.github/agents` directory contains three custom agent definitions used for AI-assisted Playwright workflows:

- `playwright-test-generator.agent.md`: generates Playwright tests from test plans
- `playwright-test-healer.agent.md`: debugs and repairs failing Playwright tests
- `playwright-test-planner.agent.md`: explores the app and creates a structured test plan

### VS Code MCP configuration

`.vscode/mcp.json` configures a local MCP server entry for Playwright using:

```json
{
	"command": "npx",
	"args": ["playwright", "run-test-mcp-server"]
}
```

This supports Playwright tooling integration in compatible editor workflows.

## Generated outputs currently in the repo

These are generated artifacts, not source files:

- `playwright-report/index.html`: the Playwright HTML report bundle
- `test-results/.last-run.json`: the last run summary

At the time this README was generated, `.last-run.json` reports:

- `status: passed`
- `failedTests: []`

The `.gitignore` is already configured to exclude Playwright outputs such as `playwright-report/` and `test-results/`.

## File-by-file reference

### Root files

- `README.md`: project documentation
- `package.json`: project metadata and direct dev dependencies
- `package-lock.json`: pinned dependency graph for reproducible installs
- `playwright.config.ts`: Playwright test runner configuration
- `.env.example`: sample environment variables for local setup
- `.gitignore`: ignore rules for Node.js, env files, and Playwright output

### Config

- `config/environment.ts`: resolves `.env.<ENV>` and exports runtime config values

### Helpers

- `helpers/logger.ts`: shared Winston logger configuration

### Pages

- `pages/login-page.ts`: login page object
- `pages/dashboard-page.ts`: dashboard page object and legacy commented code

### Tests

- `tests/login-page.spec.ts`: login scenarios
- `tests/dashboard-page.spec.ts`: dashboard sorting scenarios
- `tests/seed.spec.ts`: placeholder seed test

### Specs support

- `specs/README.md`: notes that the directory is intended for test plans

### GitHub and editor automation

- `.github/workflows/playwright.yml`: CI workflow for Playwright test execution
- `.github/workflows/copilot-setup-steps.yml`: Copilot setup workflow
- `.github/agents/playwright-test-generator.agent.md`: AI agent definition for test generation
- `.github/agents/playwright-test-healer.agent.md`: AI agent definition for test repair
- `.github/agents/playwright-test-planner.agent.md`: AI agent definition for test planning
- `.vscode/mcp.json`: MCP server registration for Playwright tooling

### Generated artifacts

- `playwright-report/index.html`: generated HTML report
- `test-results/.last-run.json`: generated last-run status summary

## Useful commands

Run the full suite:

```bash
npx playwright test
```

Run only login tests:

```bash
npx playwright test tests/login-page.spec.ts
```

Run only dashboard tests:

```bash
npx playwright test tests/dashboard-page.spec.ts
```

Run tests with a tag filter:

```bash
npx playwright test --grep @smoke
```

Open the HTML report:

```bash
npx playwright show-report
```

## Current observations

- The repository is a compact Playwright demo focused on login and product sorting flows.
- The package is marked as `commonjs`, while the TypeScript files use ES-style imports and exports. That can be workable depending on toolchain behavior, but it is something to keep consistent.
- `package.json` does not define npm scripts yet, so all execution is currently done through direct `npx playwright ...` commands.
- `tests/dashboard-page.spec.ts` uses in-place array sorting in assertions, which mutates the original arrays. Copying arrays before sorting would make those assertions safer and easier to reason about.
- `pages/dashboard-page.ts` still contains a commented legacy block, which makes the file harder to maintain than necessary.

## Suggested next cleanup steps

1. Add standard npm scripts such as `test`, `test:smoke`, and `report`.
2. Remove or move the commented legacy code from `pages/dashboard-page.ts`.
3. Create a real `.env.dev` file locally and keep `.env.example` as the template.
4. Replace mutable sort assertions with copied arrays in dashboard tests.
