import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dummy from "./Dummy";
import { userEvent } from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { handlers } from "./tests/apiRequestMocks";

export const server = setupServer(...handlers);
server.listen();

/**
 * Proof of concept for testing a React component.
 */
describe("something truthy and falsy", () => {
  it("Dummy can be rendered", () => {
    render(<Dummy url="https://www.example.com/greeting" />);
    expect(screen.getByText("Load Greeting")).toBeInTheDocument();
  });

  it("Can click Dummy", async () => {
    render(<Dummy url="https://www.example.com/greeting" />);
    const button = screen.getByText("Load Greeting");
    await userEvent.click(button);

    expect(button).toHaveTextContent("Ok");
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });
});
