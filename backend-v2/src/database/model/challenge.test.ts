import { beforeAll, describe, expect, it } from "vitest";
import { Challenge } from "./challenge";

describe("Challenge Model", () => {
  beforeAll(async () => {
    await Challenge.sync();
  });

  it("Max Score must be positive", async () => {
    await expect(
      Challenge.create({ question: "What is 2 + 2?", maxScore: 0 })
    ).rejects.toThrow();
    await expect(
      Challenge.create({ question: "What is 3 + 3?", maxScore: -1 })
    ).rejects.toThrow();
  });

  it("Can create challenge", async () => {
    const challenge = await Challenge.create({
      question: "What is 2 + 2?",
      maxScore: 10,
    });
    expect(challenge.question).toBe("What is 2 + 2?");
    expect(challenge.maxScore).toBe(10);
  });

  it("Can update challenge", async () => {
    const question = "What is the capital of France?";
    const challenge = await Challenge.create({
      question: question,
      maxScore: 10,
    });
    expect(challenge.question).toBe(question);
    expect(challenge.maxScore).toBe(10);
    const updatedQuestion = "What is the capital of Sweden?";
    await challenge.update({ question: updatedQuestion, maxScore: 20 });
    expect(challenge.question).toBe(updatedQuestion);
    expect(challenge.maxScore).toBe(20);
  });

  it("Can't create duplicate challenge", async () => {
    const question = "What is 5 x 5?";
    await Challenge.create({
      question: question,
      maxScore: 10,
    });
    await expect(
      Challenge.create({
        question: question,
        maxScore: 10,
      })
    ).rejects.toThrow();
  });
});
