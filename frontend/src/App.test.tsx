import { render, screen } from "@testing-library/react";
import App from "./App";

/**
 * Component tests for the App component.
 */
describe("App", () => {
  it("App renders without crashing", () => {
    render(<App />);
  });

  it("App shows login page by default", () => {
    render(<App />);
    const pinInputField = screen.getByLabelText("PIN Code");
    expect(pinInputField).toBeInTheDocument();
    expect(screen.getByText("Go!")).toBeInTheDocument();
  });
});
