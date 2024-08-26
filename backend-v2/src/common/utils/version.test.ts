import { describe, expect, it } from "vitest";
import { version } from "./version";

describe("version", () => {
  it("is defined", () => {
    expect(version).toBeDefined();
  });
  it("is in the format x.y.z", () => {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
