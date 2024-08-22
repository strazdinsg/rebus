import { render, screen } from "@testing-library/react";
import { ChallengeChoiceButton, getButtonId } from "./ChallengeChoiceButton";
import React from "react";
import { vi } from "vitest";
import { userEvent } from "@testing-library/user-event";

const onClick = vi.fn();

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

  it("Call the onClick callback when clicked", async () => {
    renderButton();
    await clickButton();
    expect(onClick).toHaveBeenCalledWith(challenge.id);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("Checkmark for answered challenge", () => {
    renderButton(true);
    expectCheckmark(true);
  });

  it("No checkmark for unanswered challenge", () => {
    renderButton(false);
    expectCheckmark(false);
  });

  function renderButton(submitted: boolean = false) {
    render(
      <ChallengeChoiceButton
        challenge={challenge}
        submitted={submitted}
        onClick={onClick}
      />
    );
  }

  function clickButton() {
    return userEvent.click(screen.getByTestId(getButtonId(challenge.id)));
  }

  function expectCheckmark(expected: boolean) {
    const button = screen.getByTestId(getButtonId(challenge.id));
    if (expected) {
      expect(button).toHaveTextContent("✔");
    } else {
      expect(button).not.toHaveTextContent("✔");
    }
  }
});
