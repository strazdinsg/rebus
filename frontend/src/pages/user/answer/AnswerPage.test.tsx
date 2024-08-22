import { screen, render } from "@testing-library/react";
import { AnswerPage } from "./AnswerPage";
import { BrowserRouter } from "react-router-dom";
import {
  expectAppBarText,
  regularUser,
  waitForQueryToSettle,
} from "../../../tests/testTools";
import { UserContext } from "../../../context/UserContext";
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
      <BrowserRouter>
        <UserContext.Provider value={{ user: regularUser, setUser: vi.fn() }}>
          <AnswerPage challengeId={challengeId} />
        </UserContext.Provider>
      </BrowserRouter>
    );

    await waitForQueryToSettle(() => useChallenges());
  }

  function expectQuestionText(text: string) {
    const questionElement = screen.getByText(text);
    expect(questionElement).toBeInTheDocument();
  }
});
