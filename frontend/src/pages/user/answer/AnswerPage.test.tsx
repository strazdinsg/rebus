import { screen, render } from "@testing-library/react";
import { AnswerPage } from "./AnswerPage";
import {
  expectAppBarText,
  regularUser,
  waitForQueryToSettle,
  TestMockWrapper,
} from "../../../tests/testTools";
import { useChallenges } from "../../../queries/challengeQueries";
import { mockChallenges } from "../../../tests/apiRequestMocks";

describe("AnswerPage tests", () => {
  it("Contains AppBar", async () => {
    await renderAnswerPage();
    expectAppBarText(`Challenge ${challengeId}`);
  });

  it("Contains Question text", async () => {
    await renderAnswerPage();
    expectQuestionText(challenge.question);
  });

  const challenge = mockChallenges[0];
  const challengeId = challenge.id;

  async function renderAnswerPage() {
    render(
      <TestMockWrapper user={regularUser} useRouter={true}>
        <AnswerPage challengeId={challengeId} />,
      </TestMockWrapper>
    );

    await waitForQueryToSettle(() => useChallenges());
  }

  function expectQuestionText(text: string) {
    const questionElement = screen.getByText(text);
    expect(questionElement).toBeInTheDocument();
  }
});
