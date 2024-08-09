import { ChallengeDto } from "../../common/types/dto/challengeDto";
import { select } from "../../database/select";

/**
 * Database repository for the challenges.
 */
class ChallengeRepository {
  /**
   * Retrieves all challenges from the database.
   *
   * @returns A promise that resolves with an array of ChallengeDto objects.
   * @throws The promise rejects with an error if the database query fails.
   */
  public getAll(): Promise<ChallengeDto[]> {
    return select("SELECT * FROM challenge", (row) => {
      return {
        id: row.id,
        question: row.question,
        maxScore: row.max_score,
      };
    });
  }
}
/**
 * Singleton instance of the ChallengeRepository class.
 */
export const challengeRepository = new ChallengeRepository();
