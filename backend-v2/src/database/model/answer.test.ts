import { beforeAll, describe, expect, it } from "vitest";
import { Answer } from "./answer";
import { Challenge } from "./challenge";
import { User } from "./user";

describe("Answer model", () => {
  let challenge: Challenge;
  let user: User;
  let defaultAnswer: Answer;
  const ULTIMATE_ANSWER = "42";

  beforeAll(async () => {
    await Answer.sync();
    await Challenge.sync();
    await User.sync();

    await User.create({ name: "Unused user", pin: "6677", isAdmin: true });

    user = await User.create({
      name: "Answer test user",
      pin: "1234",
      isAdmin: true,
    });

    challenge = await Challenge.create({
      question: "What is the ultimate answer?",
      maxScore: 10,
    });

    defaultAnswer = await Answer.create({
      userId: user.id,
      challengeId: challenge.id,
      answer: ULTIMATE_ANSWER,
      score: 6,
      imageUrl: "https://example.com/image.png",
    });
  });

  it("Answer created correctly", async () => {
    const answer = await getTestAnswer();
    expect(answer.id).toBe(defaultAnswer.id);
    expect(answer.answer).toBe("42");
    expect(answer.score).toBe(6);
    expect(answer.imageUrl).toBe("https://example.com/image.png");
    expect(answer.challengeId).toBe(challenge.id);
    expect(answer.userId).toBe(user.id);
  });

  it("Can navigate to challenge", async () => {
    const answer = await getTestAnswer();
    const c = await answer.getChallenge();
    expect(c.id).toBe(challenge.id);
  });

  it("Can navigate to user", async () => {
    const answer = await getTestAnswer();
    const u = await answer.getUser();
    expect(u.id).toBe(user.id);
  });

  async function getTestAnswer(): Promise<Answer> {
    const answer: Answer | null = await Answer.findOne({
      where: { answer: ULTIMATE_ANSWER },
    });
    if (!answer) {
      throw new Error("Answer not found");
    }
    return answer;
  }
});
