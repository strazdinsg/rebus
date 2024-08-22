import { render, screen } from "@testing-library/react";
import { ChallengeChoiceButton, getButtonId } from "./ChallengeChoiceButton";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { userEvent } from "@testing-library/user-event";

const fakeNavigate = vi.fn();

// Mock `useNavigate` hook
vi.mock("react-router-dom", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("react-router-dom")>()),
    useNavigate: (url: string) => fakeNavigate,
  };
});

describe("ChallengeChoiceButton tests", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const challenge = {
    id: 1,
    question: "What is the answer to life, the universe, and everything?",
    maxScore: 10,
  };

  it("renders without crashing", () => {
    renderButton();
  });

  it("Navigates to the challenge page when clicked", async () => {
    // Arrange
    renderButton();

    // Act
    await userEvent.click(screen.getByTestId(getButtonId(challenge.id)));

    // Assert
    expect(fakeNavigate).toHaveBeenCalledWith("/answer/" + challenge.id);
    expect(fakeNavigate).toHaveBeenCalledTimes(1);
  });

  it("Checkmark for answered challenge", () => {
    renderButton(true);
    expect(screen.getByTestId(getButtonId(challenge.id))).toHaveTextContent(
      "✔"
    );
  });

  it("No checkmark for unanswered challenge", () => {
    renderButton(false);
    expect(screen.getByTestId(getButtonId(challenge.id))).not.toHaveTextContent(
      "✔"
    );
  });

  function renderButton(submitted: boolean = false) {
    render(
      <BrowserRouter>
        <ChallengeChoiceButton challenge={challenge} submitted={submitted} />
      </BrowserRouter>
    );
  }
});
