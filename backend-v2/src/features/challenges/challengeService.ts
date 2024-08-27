import { ChallengeDto } from "../../common/types/dto/challengeDto";
import { Challenge } from "../../database/model/challenge";

/**
 * Service for the challenges.
 */
class ChallengeService {
  /**
   * Retrieves all challenges from the database.
   *
   * @returns A promise that resolves with an array of ChallengeDto objects.
   * @throws The promise rejects with an error if the database query fails.
   */
  public async getAll(): Promise<ChallengeDto[]> {
    return await Challenge.findAll();
  }
}
/**
 * Singleton instance of the ChallengeRepository class.
 */
export const challengeService = new ChallengeService();
