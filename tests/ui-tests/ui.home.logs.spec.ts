import { test, expect } from "@playwright/test";

test("Home Page has no console errors", async ({ page }) => {
  const KNOWN_ERROR_LOGS = new Set([
    `Failed to load resource: net::ERR_NAME_NOT_RESOLVED`, // Known errors here
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

  // verify the known errors are still present
  KNOWN_ERROR_LOGS.forEach((item) => {
    expect.soft(allErrorLogs.includes(item)).toBeTruthy();
  });
});
