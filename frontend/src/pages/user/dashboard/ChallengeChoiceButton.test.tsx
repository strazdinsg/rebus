import { render, screen } from "@testing-library/react";
import { ChallengeChoiceButton, getButtonId } from "./ChallengeChoiceButton";
import { vi } from "vitest";
import { userEvent } from "@testing-library/user-event";

const onClick = vi.fn();

describe("ChallengeChoiceButton tests", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    renderButton();
  });

  const challengeId = 1;

  it("Call the onClick callback when clicked", async () => {
    renderButton();
    await clickButton();
    expect(onClick).toHaveBeenCalledWith(challengeId);
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
        challengeId={challengeId}
        answered={submitted}
        onClick={onClick}
      />
    );
  }

  function clickButton() {
    return userEvent.click(screen.getByTestId(getButtonId(challengeId)));
  }

  function expectCheckmark(expected: boolean) {
    const button = screen.getByTestId(getButtonId(challengeId));
    if (expected) {
      expect(button).toHaveTextContent("✔");
    } else {
      expect(button).not.toHaveTextContent("✔");
    }
  }
});
