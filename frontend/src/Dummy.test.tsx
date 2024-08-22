import { describe, it, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dummy from "./Dummy";
import { userEvent } from "@testing-library/user-event";
import axios from "axios";
import React from "react";

// Mock all axios HTTP requests
vi.mock("axios");

/**
 * Proof of concept for testing a React component.
 */
describe("something truthy and falsy", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Dummy can be rendered", () => {
    render(<Dummy url="https://www.example.com" />);
    expect(screen.getByText("Load Greeting")).toBeInTheDocument();
  });

  it("Can click Dummy", async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: {
        greeting: "Hello, world!",
      },
    });

    render(<Dummy url="https://www.example.com" />);
    const button = screen.getByText("Load Greeting");
    await userEvent.click(button);

    expect(button).toHaveTextContent("Ok");
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });
});
