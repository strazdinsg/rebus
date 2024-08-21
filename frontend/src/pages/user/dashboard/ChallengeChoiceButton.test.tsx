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
  const challenge = {
    id: 1,
    question: "What is the answer to life, the universe, and everything?",
    maxScore: 10,
  };

  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ChallengeChoiceButton challenge={challenge} submitted={false} />
      </BrowserRouter>
    );
  });

  it("Navigates to the challenge page when clicked", async () => {
    // Arrange
    render(
      <BrowserRouter>
        <ChallengeChoiceButton challenge={challenge} submitted={false} />
      </BrowserRouter>
    );

    // Act
    const button = screen.getByTestId(getButtonId(challenge.id));
    await userEvent.click(button);

    // Assert
    expect(fakeNavigate).toHaveBeenCalledWith("/answer/" + challenge.id);
  });
});
