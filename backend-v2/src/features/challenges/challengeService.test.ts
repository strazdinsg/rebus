import { describe, it, expect, vi } from "vitest";
import { challengeService } from "./challengeService";
import { Challenge } from "../../database/model/challenge";

describe("Challenge Service", () => {
  it("Challenges from DB are returned", async () => {
    const mockChallenges: Challenge[] = [
      Challenge.build({ id: 1, question: "What is 2 + 2?", maxScore: 10 }),
      Challenge.build({
        id: 2,
        question: "What is the capital of France?",
        maxScore: 5,
      }),
    ];
    vi.spyOn(Challenge, "findAll").mockResolvedValue(mockChallenges);

    const result = await challengeService.getAll();
    expect(result).toEqual(mockChallenges);
  });

  it("Handle errors when executeQuery fails", async () => {
    const e = new Error("Database error");
    vi.spyOn(Challenge, "findAll").mockRejectedValue(e);
    await expect(challengeService.getAll()).rejects.toThrow();
  });
});
