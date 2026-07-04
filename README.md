# Playwright Playground

🐳 **Docker-ready** | 🎭 Playwright + TypeScript | API & E2E Testing

A TypeScript-based Playwright test automation framework showcasing both API and End-to-End (E2E) testing practices.

Fully containerized with Docker for consistent, environment-agnostic test execution.

**Website Under Test:** [Conduit (Learn WebdriverIO)](https://demo.learnwebdriverio.com/)

---

## 📊 Live Test Report - GitHub Pages

Every push triggers the full suite via GitHub Actions, with the HTML report published automatically to GitHub Pages:

**🔗 [View the latest test report](https://oleskicode.github.io/Playwright-Typescript-with-GitHubActions-conduit-oleski/)**

The report includes full traces, screenshots, and step-by-step breakdowns for every run, across all projects (`chromium-desktop`, `chromium-pixel9`, `webkit-iphone16`) — always reflecting the most recent commit on `master`.

---

## Technologies Used

- [Playwright](https://playwright.dev/) - A Node.js library to automate Chromium, Firefox and WebKit with a single API.
- [TypeScript](https://www.typescriptlang.org/) - A strongly typed superset of JavaScript that compiles to plain JavaScript.
- [Docker](https://www.docker.com/) - Containerized test execution with all browser engines pre-installed, no local setup required.
- [Node.js](https://nodejs.org/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.

## Prerequisites

Before running the tests, ensure you have an active, registered user account on the website.

## Getting Started

1. **Clone the repository and install dependencies:**

```bash
npm install
```

2. **Install Playwright Browsers:**

```bash
npx playwright install
```

3. **Configure Environment Variables:**

Create a `.env` file in the root folder of the project and populate it with your registered user credentials:

```env
USER_NAME=someJohn
USER_EMAIL=john@testemail.com
USER_PASSWORD=sdfgsADSG123
API_BASE_URL=https://conduit-api.learnwebdriverio.com/api
BASE_URL=https://demo.learnwebdriverio.com
```

4. **Run the tests:**

```bash
npx playwright test
```

5. **View the test report:**

```bash
npx playwright show-report
```

---

## Mobile coverage: Chromium and WebKit included

`playwright.config.ts` defines 3 projects: a desktop Chromium baseline, a Pixel Chromium project, and an iPhone project that runs on **WebKit**

---

## Running with Docker

The test suite is fully containerized using the official Playwright image, which bundles the Chromium and WebKit engines so no local browser installation is required.

1. **Build the image:**

```bash
docker compose build
```

2. **Run the full suite:**

```bash
docker compose run --rm tests
```

This spins up a container that runs `globalSetup` (registering the test user via the API, fetching an auth token, and seeding `localStorage`), then executes all 60 tests across the `chromium-desktop`, `chromium-pixel9`, and `webkit-iphone16` projects.

3. **View results:**

Test artifacts are written to the host via volume mounts, so they're available after the container exits:

```bash
npx playwright show-report   # opens ./playwright-report
ls test-results/             # screenshots, traces for failed tests
```

### Rebuilding after code changes

The image is built once from a snapshot of the project (`COPY . .` in the `Dockerfile`). Editing test files locally does not change an already-built image — rebuild to pick up changes:

```bash
docker compose build
docker compose run --rm tests
```

### Notes from building this out

- **Worker count**: `playwright.config.ts` sets `workers: 1` when `CI=true` (set in `docker-compose.yml`) for deterministic runs. Local runs can override this for speed, e.g. `docker compose run --rm tests npx playwright test --workers=4`. Tests hit a shared external demo API, so higher worker counts increase load on a backend outside our control — 4 workers roughly halved run time in testing here, but it's worth re-tuning per environment rather than assuming.
- **Test data isolation**: an earlier version of `helpers/userFactory.ts` generated usernames via `faker.person.firstName()`, drawn from a small fixed pool. Under parallel execution against a long-lived shared backend, this occasionally collided with already-registered usernames. Now fixed by appending a timestamp + random suffix to guarantee uniqueness per run.

---

## Project Structure

- `tests/` - Contains all API and E2E test files.
  - `api-tests/` - API specific tests.
  - `ui-tests/` - User interface specific tests.
- `pages/` - Page Object Model implementations for UI tests.
- `fixtures/` - Custom Playwright fixtures for authenticated API contexts and page objects.
- `helpers/` - Helper functions and utilities for common tasks.
- `setup/` - Setup files for global test configurations, like user registration.
- `playwright.config.ts` - Global Playwright configuration, timeouts, and browser matrices.
- `.env.example` - Template for environment variables (tracked in git).
- `Dockerfile` - Defines the containerized test runner image.
- `docker-compose.yml` - Orchestrates running the suite in a container.
- `.dockerignore` - Excludes files (like `node_modules`, `.env`) from the build context.
