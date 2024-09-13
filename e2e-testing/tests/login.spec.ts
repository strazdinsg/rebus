import { test, expect } from "@playwright/test";
import { ADMIN_PIN, USER_PIN } from "../common";
import {
  expectAdminDashboard,
  expectUserDashboard,
  loginWithPin,
} from "./testTools";

test("Login with wrong PIN fails", async ({ page }) => {
  await page.goto("/");
  await loginWithPin("0000", page);
  await expect(page.getByText("Wrong PIN")).toBeVisible();
});

test("Can log in as user", async ({ page }) => {
  await page.goto("/");
  await loginWithPin(USER_PIN, page);
  await expectUserDashboard(page);
});

test("Can log in as admin", async ({ page }) => {
  await page.goto("/");
  await loginWithPin(ADMIN_PIN, page);
  await expectAdminDashboard(page);
});
