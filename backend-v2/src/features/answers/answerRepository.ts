import { TeamAnswerDto } from "../../common/types/dto/teamAnswerDto";
import { AnswerDto } from "../../common/types/dto/answerDto";
import { getConnection } from "../../database/databaseManager";
import { toNullableNumber } from "../../database/resultRow";

type ExtendedAnswerDto = AnswerDto & { teamId: number };

/**
 * Database repository for the answers.
 */
class AnswerRepository {
  /**
   * Retrieves all answers from the database.
   *
   * @returns A promise that resolves with an array of TeamAnswerDto objects.
   * @throws The promise rejects with an error if the database query fails.
   */
  async getAll(): Promise<TeamAnswerDto[]> {
    const connection = getConnection();
    const ungroupedAnswers: ExtendedAnswerDto[] = await connection.query(
      "SELECT * FROM answer",
      (row) => {
        return {
          teamId: parseInt(row.user_id),
          challengeId: parseInt(row.challenge_id),
          answer: row.answer,
          score: toNullableNumber(row.score),
          imageUrl: row.image_url,
        };
      }
    );
    let teamAnswers: TeamAnswerDto[] = [];
    for (const answer of ungroupedAnswers) {
      _appendAnswerToTeamAnswers(teamAnswers, answer);
    }
    return teamAnswers;
  }
}

// TODO - test this function
function _appendAnswerToTeamAnswers(
  teamAnswers: TeamAnswerDto[],
  answer: ExtendedAnswerDto
) {
  const answerDto: AnswerDto = {
    challengeId: answer.challengeId,
    answer: answer.answer,
    score: answer.score,
    imageUrl: answer.imageUrl,
  };
  const teamAnswer = teamAnswers.find(
    (teamAnswer) => teamAnswer.teamId === answer.teamId
  );
  if (teamAnswer) {
    teamAnswer.answers.push(answerDto);
  } else {
    teamAnswers.push({
      teamId: answer.teamId,
      answers: [answerDto],
    });
  }
}

export const answerRepository = new AnswerRepository();
