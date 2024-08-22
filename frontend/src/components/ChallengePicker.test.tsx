import { render, screen } from "@testing-library/react";
import { ChallengePicker } from "./ChallengePicker";
import { UserSession } from "../context/UserContext";
import { ChallengeDto, TeamAnswerDto } from "../api-v2/models";
import { getButtonId } from "../pages/user/dashboard/ChallengeChoiceButton";

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
    renderChallengePicker(user, false, null, []);
    expect(screen.getByText("No challenges found")).toBeInTheDocument();
  });

  it("Error message on data fetching error", () => {
    renderChallengePicker(user, false, Error("Could not load data"));
    expect(
      screen.getByText("Data error, contact the developer")
    ).toBeInTheDocument();
  });

  it("Challenge buttons shown", () => {
    renderChallengePicker(user, false, null, challenges, answers);
    expectUserName();
    expectChallengeButtons();
  });

  function renderChallengePicker(
    user: UserSession | null = null,
    pending: boolean = false,
    error: Error | null = null,
    challenges: ChallengeDto[] = [],
    answers: TeamAnswerDto | null = null
  ) {
    const challengesQuery = {
      isPending: pending,
      error: error,
      data: challenges,
    };
    const answersQuery = {
      isPending: pending,
      error: error,
      data: answers,
    };
    render(
      <ChallengePicker
        user={user}
        challenges={challengesQuery}
        myAnswers={answersQuery}
        onPick={onPick}
      />
    );
  }

  function expectUserName() {
    expect(screen.getByText(user.name)).toBeInTheDocument();
  }

  function expectChallengeButtons() {
    challenges.forEach((challenge) => {
      expect(screen.getByTestId(getButtonId(challenge.id))).toBeInTheDocument();
    });
  }

  // Data for the tests
  const user = {
    id: 1,
    name: "John Doe",
    roles: ["ROLE_USER"],
    isAdmin: false,
  };

  const challenges: ChallengeDto[] = [
    {
      id: 1,
      question: "What is the answer to life, the universe, and everything?",
      maxScore: 100,
    },
    {
      id: 2,
      question: "What is the capital of France?",
      maxScore: 10,
    },
  ];

  const answers: TeamAnswerDto = {
    answers: [
      {
        answer: "42",
        challengeId: 1,
        imageUrl: null,
        score: null,
      },
      {
        answer: "Paris",
        challengeId: 2,
        imageUrl: null,
        score: null,
      },
    ],
    teamId: 1,
  };
});
