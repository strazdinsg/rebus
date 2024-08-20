// A dummy test of a UI component, with axios request mocking

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dummy from "../Dummy";
import { rest } from "msw";
import { setupServer } from "msw/node";

// declare which API requests to mock
const server = setupServer(
  // capture "GET /greeting" requests
  rest.get("/greeting", (req, res, ctx) => {
    // respond using a mocked JSON body
    return res(ctx.json({ greeting: "hello there" }));
  })
);

// establish API mocking before all tests
beforeAll(() => server.listen());

// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());

// clean up once the tests are done
afterAll(() => server.close());

test("Dummy button shown by default", async () => {
  render(<Dummy url="/greeting" />);

  expect(screen.getByText("Load Greeting")).toBeInTheDocument();
});

test("Greeting loaded", async () => {
  render(<Dummy url="/greeting" />);

  fireEvent.click(screen.getByText("Load Greeting"));

  const heading = await screen.findByRole("heading");
  expect(heading).toHaveTextContent("hello there");
});
