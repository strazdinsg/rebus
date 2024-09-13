import { expect, Page } from "@playwright/test";
import { USER_NAME } from "../common";

/**
 * Expect the login page to be visible.
 *
 * @param page The test Page object
 */
export async function expectLoginPage(page: Page) {
  await expect(page.getByPlaceholder("123456")).toBeVisible();
  await expect(page.getByRole("button")).toContainText("Go!");
}

/**
 * Log in with the given pin.
 *
 * @param pin The pin to log in with
 * @param page The test Page object
 */
export async function loginWithPin(pin: string, page: Page) {
  await page.getByPlaceholder("123456").click();
  await page.getByPlaceholder("123456").fill(pin);
  await page.getByRole("button", { name: "Go!" }).click();
}

/**
 * Expect the admin dashboard to be visible.
 *
 * @param page The test Page object
 */
export async function expectAdminDashboard(page: Page) {
  await expect(
    page.getByRole("heading", { name: "Admin dashboard" })
  ).toBeVisible();
}

/**
 * Expect the user dashboard to be visible.
 *
 * @param page The test Page object
 */
export async function expectUserDashboard(page: Page) {
  await expect(page.getByRole("heading", { name: USER_NAME })).toBeVisible();
}
