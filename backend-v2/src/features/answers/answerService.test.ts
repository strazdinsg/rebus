import { beforeEach, describe, expect, it } from "vitest";
import { Answer } from "../../database/model/answer";
import { Challenge } from "../../database/model/challenge";
import { User } from "../../database/model/user";
import { answerService } from "./answerService";

describe("Answer service", () => {
  let defaultUser: User;
  let userWithoutAnswer: User;
  let defaultChallenge: Challenge;
  let challengeWithoutAnswer: Challenge;

  beforeEach(async () => {
    await _ensureTablesAreCreated();
    await _insertTestData();
  });

  it("Save a new answer", async () => {
    const countBefore = await Answer.count();
    await answerService.saveAnswer(
      challengeWithoutAnswer.id,
      userWithoutAnswer.id,
      "This is a new test answer"
    );

    const countAfter = await Answer.count();
    expect(countAfter).toBe(countBefore + 1);
  });

  it("Update an existing answer", async () => {
    const countBefore = await Answer.count();
    await answerService.saveAnswer(
      defaultChallenge.id,
      defaultUser.id,
      "An existing answer has been updated"
    );

    const countAfter = await Answer.count();
    expect(countAfter).toBe(countBefore);
    const answerCount = await Answer.count({
      where: { challengeId: defaultChallenge.id, userId: defaultUser.id },
    });
    expect(answerCount).toBe(1);
    const updatedAnswer: Answer | null = await Answer.findOne({
      where: { challengeId: defaultChallenge.id, userId: defaultUser.id },
    });
    expect(updatedAnswer).toBeTruthy();
  });

  async function _ensureTablesAreCreated() {
    await Answer.drop();
    await Answer.sync();
    await User.sync();
    await Challenge.sync();
  }

  async function _insertTestData() {
    const users = [
      await _insertUser(1),
      await _insertUser(2),
      await _insertUser(3),
    ];
    defaultUser = users[0];
    userWithoutAnswer = users[1];
    const challenges = [await _insertChallenge(1), await _insertChallenge(2)];
    defaultChallenge = challenges[0];
    challengeWithoutAnswer = challenges[1];
    await _insertAnswer(
      defaultUser.id,
      defaultChallenge.id,
      "This is a test answer"
    );
  }

  async function _insertUser(userNumber: number): Promise<User> {
    const [user, inserted] = await User.upsert({
      name: `Answer Service test user ${userNumber}`,
      pin: "6677",
      isAdmin: true,
    });
    return user;
  }

  async function _insertChallenge(challengeNumber: number) {
    const [challenge, created] = await Challenge.upsert({
      question: `Challenge number ${challengeNumber}`,
      maxScore: 10 + challengeNumber,
    });
    return challenge;
  }

  async function _insertAnswer(
    userId: number,
    challengeId: number,
    answer: string
  ) {
    await Answer.create({
      userId,
      challengeId,
      answer: answer,
    });
  }
});
