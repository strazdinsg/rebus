import { expect, test } from "@jest/globals";
import { packageInfo } from "./packageInfo";

test("packageInfo is defined", () => {
  expect(packageInfo).toBeDefined();
});
