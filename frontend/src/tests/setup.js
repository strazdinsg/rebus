import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Setup for vitest and React testing library
expect.extend(matchers);

afterEach(() => {
  cleanup();
});
