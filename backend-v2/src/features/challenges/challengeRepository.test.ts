import { describe, it, expect, vi } from "vitest";
import { challengeRepository } from "./challengeRepository";
import { ChallengeDto } from "../../common/types/dto/challengeDto";

const queryMock = vi.fn();

vi.mock("../../database/databaseManager", () => {
  return {
    getConnection: () => {
      return {
        query: queryMock,
        close: () => {
          return Promise.resolve();
        },
      };
    },
  };
});

describe("ChallengeRepository", () => {
  it("Challenges from DB are returned", async () => {
    const mockChallenges: ChallengeDto[] = [
      { id: 1, question: "What is 2 + 2?", maxScore: 10 },
      { id: 2, question: "What is the capital of France?", maxScore: 5 },
    ];
    queryMock.mockImplementationOnce(() => {
      return Promise.resolve(mockChallenges);
    });

    const result = await challengeRepository.getAll();
    expect(result).toEqual(mockChallenges);
  });

  it("Handle errors when executeQuery fails", async () => {
    const e = new Error("Database error");
    queryMock.mockImplementationOnce(() => {
      throw e;
    });
    await expect(challengeRepository.getAll()).rejects.toThrow();
  });
});
