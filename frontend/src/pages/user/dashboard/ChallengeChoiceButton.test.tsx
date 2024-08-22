import { render, screen } from "@testing-library/react";
import { ChallengeChoiceButton, getButtonId } from "./ChallengeChoiceButton";
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
    await userEvent.click(screen.getByTestId(getButtonId(challenge.id)));
    expect(onClick).toHaveBeenCalledWith(challenge.id);
    expect(onClick).toHaveBeenCalledTimes(1);
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
      <ChallengeChoiceButton
        challenge={challenge}
        submitted={submitted}
        onClick={onClick}
      />
    );
  }
});
