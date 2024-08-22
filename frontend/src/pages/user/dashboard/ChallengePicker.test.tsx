import { render, screen } from "@testing-library/react";
import { ChallengePicker } from "./ChallengePicker";
import { UserSession } from "../../../context/UserContext";
import { getButtonId } from "./ChallengeChoiceButton";

const onPick = vi.fn();

describe("ChallengePicker tests", () => {
  it("Loading... when user not set", () => {
    renderChallengePicker();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("Loading... when user is set but data is loading", () => {
    renderChallengePicker(user, true);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("Message when no challenges found", () => {
    renderChallengePicker(user, false, false, []);
    expect(screen.getByText("No challenges found")).toBeInTheDocument();
  });

  it("Error message on data fetching error", () => {
    renderChallengePicker(user, false, true);
    expect(
      screen.getByText("Data error, contact the developer")
    ).toBeInTheDocument();
  });

  it("Challenge buttons shown", () => {
    renderChallengePicker(user, false, false, challengeIds);
    expectChallengeButtons();
  });

  function renderChallengePicker(
    user: UserSession | null = null,
    pending: boolean = false,
    error: boolean = false,
    challengeIds: number[] = []
  ) {
    render(
      <ChallengePicker
        user={user}
        challengeIds={challengeIds}
        answered={answered}
        onPick={onPick}
        pending={pending}
        error={error}
      />
    );
  }

  function expectChallengeButtons() {
    challengeIds.forEach((challengeId) => {
      expect(screen.getByTestId(getButtonId(challengeId))).toBeInTheDocument();
    });
  }

  // Data for the tests
  const user = {
    id: 1,
    name: "John Doe",
    roles: ["ROLE_USER"],
    isAdmin: false,
  };

  const challengeIds: number[] = [1, 2, 3, 4];

  const answered = [2, 1];
});
