import { expect, test } from "@jest/globals";

function sum(a: number, b: number): number {
  return a + b;
}

test("PoC Jest test", () => {
  expect(sum(2, 3)).toBe(5);
});
