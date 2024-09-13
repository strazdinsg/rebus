import { test, expect } from "@playwright/test";
import { expectLoginPage } from "./testTools";

test("Correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Rebus");
});

test("login page shown by default", async ({ page }) => {
  await page.goto("/");
  await expectLoginPage(page);
});
