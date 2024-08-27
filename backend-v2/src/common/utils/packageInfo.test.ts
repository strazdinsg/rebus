import { expect, test } from "vitest";
import { packageInfo } from "./packageInfo";

test("packageInfo is defined", () => {
  expect(packageInfo).toBeDefined();
});
