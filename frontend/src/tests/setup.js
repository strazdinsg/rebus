import { expect, afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { setupServer } from "msw/node";
import { handlers } from "./apiRequestMocks";

export const server = setupServer(...handlers);
server.listen();

// Setup for vitest and React testing library
expect.extend(matchers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  // Reset API request mocks
  server.resetHandlers();
  // Cleanup the DOM tree after each test
  cleanup();
});

afterAll(() => {
  server.close();
});
