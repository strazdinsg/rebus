import { expect, test } from "@jest/globals";
import { packageInfo } from "../common/utils/packageInfo";

test("packageInfo is defined", () => {
  expect(packageInfo).toBeDefined();
});
