import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { challengeRepository } from "./challengeRepository";

// Mock all the database functions
jest.mock("../../database/database");

// This is needed, don't convert to import!
const database = require("../../database/database");

describe("ChallengeRepository", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Convert database entries to ChallengeDto objects correctly", async () => {
    const mockRows = [
      { id: 1, question: "What is 2 + 2?", max_score: 10 },
      { id: 2, question: "What is the capital of France?", max_score: 5 },
    ];
    database.executeQuery.mockResolvedValue(mockRows);

    const result = await challengeRepository.getAll();

    expect(result).toEqual([
      { id: 1, question: "What is 2 + 2?", maxScore: 10 },
      { id: 2, question: "What is the capital of France?", maxScore: 5 },
    ]);
  });

  test("Handle errors when executeQuery fails", async () => {
    const e = new Error("Database error");
    database.executeQuery.mockRejectedValue(e);
    await expect(challengeRepository.getAll()).rejects.toThrow();
  });
});
