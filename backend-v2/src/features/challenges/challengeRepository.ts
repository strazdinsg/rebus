import { ChallengeDto } from "../../common/types/dto/challengeDto";
import { getConnection } from "../../database/databaseManager";

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
  public async getAll(): Promise<ChallengeDto[]> {
    const connection = getConnection();
    return await connection.query("SELECT * FROM challenge", (row) => {
      return {
        id: parseInt(row.id),
        question: row.question,
        maxScore: parseInt(row.max_score),
      };
    });
  }
}
/**
 * Singleton instance of the ChallengeRepository class.
 */
export const challengeRepository = new ChallengeRepository();
