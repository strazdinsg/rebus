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
    await Answer.drop();
    await Challenge.drop();
    await User.drop();

    await Challenge.sync();
    await User.sync();
    await Answer.sync();

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
    const answer = await _getTestAnswer();
    expect(answer.id).toBe(defaultAnswer.id);
    expect(answer.answer).toBe("42");
    expect(answer.score).toBe(6);
    expect(answer.imageUrl).toBe("https://example.com/image.png");
    expect(answer.challengeId).toBe(challenge.id);
    expect(answer.userId).toBe(user.id);
  });

  it("Can navigate to challenge", async () => {
    const answer = await _getTestAnswer();
    const c = await answer.getChallenge();
    expect(c.id).toBe(challenge.id);
  });

  it("Can navigate to user", async () => {
    const answer = await _getTestAnswer();
    const u = await answer.getUser();
    expect(u.id).toBe(user.id);
  });

  it("Save a new answer", async () => {
    const anotherUser = await _createAnotherUser();
    const anotherChallenge = await _createAnotherChallenge();

    const [newAnswer, created] = await Answer.upsert(
      {
        challengeId: anotherChallenge.id,
        userId: anotherUser.id,
        answer: "43",
      },
      {
        returning: true,
      }
    );
    expect(newAnswer).toBeDefined();
    expect(newAnswer.id).toBeDefined();
    expect(newAnswer.answer).toBe("43");
    expect(newAnswer.score).not.toBeTruthy();
    expect(newAnswer.imageUrl).not.toBeTruthy();
    expect(newAnswer.challengeId).toBe(anotherChallenge.id);
    expect(newAnswer.userId).toBe(anotherUser.id);
  });

  it("Update an existing answer", async () => {
    const originalCount = await Answer.count();

    const NEW_IMAGE_URL = "https://example.com/image2.png";
    const [upsertAnswer, created] = await Answer.upsert(
      {
        challengeId: challenge.id,
        userId: user.id,
        answer: "678",
        imageUrl: NEW_IMAGE_URL,
      },
      {
        returning: true,
      }
    );
    expect(await Answer.count()).toBe(originalCount);

    const newAnswer = await Answer.findOne({
      where: { userId: user.id, challengeId: challenge.id },
    });
    // Uncomment this when Sequelize has fixed this bug
    // https://github.com/sequelize/sequelize/issues/17455
    // expect(upserAnswer?.id).toBe(defaultAnswer.id);

    if (!newAnswer) {
      throw new Error("New answer was not created!");
    }
    expect(newAnswer.answer).toBe("678");
    expect(newAnswer.imageUrl).toBe(NEW_IMAGE_URL);
    expect(newAnswer.userId).toBe(user.id);
    expect(newAnswer.challengeId).toBe(challenge.id);
    expect(newAnswer.id).toBe(defaultAnswer.id);
  });

  async function _getTestAnswer(): Promise<Answer> {
    const answer: Answer | null = await Answer.findOne({
      where: { answer: ULTIMATE_ANSWER },
    });
    if (!answer) {
      throw new Error("Answer not found");
    }
    return answer;
  }

  async function _createAnotherUser(): Promise<User> {
    return User.create({
      name: "Another user",
      pin: "5566",
      isAdmin: false,
    });
  }

  async function _createAnotherChallenge(): Promise<Challenge> {
    return Challenge.create({
      question: "What is the second most important answer?",
      maxScore: 9,
    });
  }
});
