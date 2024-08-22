import { screen, render } from "@testing-library/react";
import { AnswerSubmitForm } from "./AnswerSubmitForm";
import { mockAnswers, mockChallenges } from "../../../tests/apiRequestMocks";
import {
  getButtonByName,
  regularUser,
  TestMockWrapper,
} from "../../../tests/testTools";
import { AnswerDto } from "../../../api-v1/models";

describe("AnswerSubmitForm tests", () => {
  it("Answer submit form renders", () => {
    renderAnswerSubmitForm();
  });

  it("Answer submit form shows question", () => {
    renderAnswerSubmitForm();
    expectQuestionText();
  });

  it("Answer submit form shows answer input field", () => {
    renderAnswerSubmitForm();
    expectAnswerInputField();
  });

  it("Answer submit form shows image upload button", () => {
    renderAnswerSubmitForm();
    expectImageUploadButton();
  });

  it("Answer submit form shows image preview", () => {
    renderAnswerSubmitForm();
    expectImagePreview();
  });

  it("Answer submit form shows send button", () => {
    renderAnswerSubmitForm();
    expectSendButton();
  });

  it("Button is disabled when answer field is empty", () => {
    renderAnswerSubmitForm(null);
    expectSendButtonEnabled(false);
  });

  it("Button is enabled when answer field is not empty", () => {
    renderAnswerSubmitForm(answer);
    expectSendButtonEnabled(true);
  });

  it("Answer without image does not have an image", () => {
    renderAnswerSubmitForm({
      answer: "Answer without image",
      challengeId: challenge.id,
      imageUrl: null,
    });
    expectImageUrl(null);
  });

  it("Correct image URL", () => {
    renderAnswerSubmitForm(answer);
    expectImageUrl(answer.imageUrl);
  });

  function renderAnswerSubmitForm(answer: AnswerDto | null = null) {
    render(
      <TestMockWrapper user={user}>
        <AnswerSubmitForm
          challengeId={challenge.id}
          userId={user.id}
          question={challenge.question}
          submittedAnswer={answer}
        />
      </TestMockWrapper>
    );
  }

  const challenge = mockChallenges[0];
  const user = regularUser;
  const answer = mockAnswers.answers[0];

  function expectQuestionText() {
    const questionElement = screen.getByText(challenge.question);
    expect(questionElement).toBeInTheDocument();
  }

  function expectAnswerInputField() {
    const answerInputField = screen.getByLabelText("Your answer");
    expect(answerInputField).toBeInTheDocument();
  }

  function expectImageUploadButton() {
    expect(getButtonByName("Add photo")).toBeInTheDocument();
  }

  function expectImagePreview() {
    const imageElement = screen.getByAltText("User-submitted image preview");
    expect(imageElement).toBeInTheDocument();
  }

  function expectSendButton() {
    expect(getButtonByName("Send")).toBeInTheDocument();
  }

  function expectSendButtonEnabled(enabled: boolean) {
    const sendButton = getButtonByName("Send");
    expect(sendButton).toBeInTheDocument();
    if (enabled) {
      expect(sendButton).toBeEnabled();
    } else {
      expect(sendButton).toBeDisabled();
    }
  }

  function expectImageUrl(imageUrl: string | null) {
    const imageElement = screen.getByAltText("User-submitted image preview");
    expect(imageElement).toBeInTheDocument();
    if (imageUrl) {
      expect(imageElement).toHaveAttribute("src", imageUrl);
    } else {
      expect(imageElement).toHaveAttribute("src", "");
    }
  }
});
