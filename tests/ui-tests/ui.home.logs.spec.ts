import { test, expect } from "@playwright/test";

test("Home Page has no new Console Errors", async ({ page }) => {
  const KNOWN_ERROR_LOGS = new Set([
    // List known errors here:
    "Failed to load resource: net::ERR_NAME_NOT_RESOLVED",
    "Failed to load resource: Error resolving “cdn.polyfill.io”: Name or service not known",
    "Failed to load resource: the server responded with a status of 404 (Not Found)",
    "Failed to load resource: A server with the specified hostname could not be found.",
  ]);

  const allConsoleLogs: Array<{ text: string; type: string }> = [];
  page.on("console", (message) => {
    allConsoleLogs.push({ text: message.text(), type: message.type() });
  });

  await page.goto("/");

  const allErrorLogs = allConsoleLogs
    .filter((log) => log.type === "error")
    .map((log) => log.text); // filter all errors

  const newErrorLogs = allErrorLogs.filter((log) => !KNOWN_ERROR_LOGS.has(log)); // filter all new unknown errors

  expect.soft(newErrorLogs).toHaveLength(0); // verify there are zero new errors
});
