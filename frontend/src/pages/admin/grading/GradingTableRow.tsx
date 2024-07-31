import ScoreSelectBox from "./ScoreSelectBox";
import { TeamDto } from "schemas/src/team";
import { ShortTeamAnswersDto } from "schemas/src/answer";
import { useChallenges } from "../../../queries/challengeQueries";
import { useAllAnswers, useUpdateScore } from "../../../queries/answerQueries";

/**
 * One row in the grading table - for one team
 */
export function GradingTableRow(props: { team: TeamDto }) {
  const challenges = useChallenges();
  const allAnswers = useAllAnswers();
  const updateScore = useUpdateScore();

  if (challenges.isPending || allAnswers.isPending) {
    return renderMessage("Loading...");
  }

  if (challenges.error || allAnswers.error) {
    return renderMessage("Could not load data, contact the developer");
  }

  if (updateScore.error) {
    return renderMessage("Could not save score, contact the developer");
  }

  if (!challenges || !challenges.data) {
    return renderMessage("No challenges found");
  }

  const teamAnswers = getTeamAnswers(allAnswers.data);

  return (
    <tr>
      <td>
        {props.team.name}
        <br />({getTotalScore()})
      </td>
      {challenges.data.map((challenge, index) => (
        <td key={index}>
          <ScoreSelectBox
            score={getScoreForChallenge(challenge.id)}
            maxScore={challenge.maxScore}
            saveScore={(score: number | null) => saveScore(score, challenge.id)}
          />
          {getAnswerForChallenge(challenge.id)}
        </td>
      ))}
    </tr>
  );

  function getTeamAnswers(allAnswers: ShortTeamAnswersDto[]) {
    if (allAnswers == null) return null;
    const teamAnswers = allAnswers.find(
      (answer) => answer.teamId === props.team.id
    );
    return teamAnswers || null;
  }

  function getAnswerForChallenge(challengeId: number) {
    if (teamAnswers === null) {
      return null;
    }
    const answer = teamAnswers.answers[challengeId - 1];
    if (answer === null) return null;

    return <p>{answer}</p>;
  }

  function getScoreForChallenge(challengeId: number): number | null {
    if (teamAnswers === null) {
      return null;
    }
    return teamAnswers.scores[challengeId - 1];
  }

  function saveScore(score: number | null, challengeId: number) {
    updateScore.mutate({
      challengeId: challengeId,
      userId: props.team.id,
      score: score,
    });
  }

  function getTotalScore() {
    if (!teamAnswers) return 0;

    return teamAnswers.scores.reduce(
      (total, current) => (total || 0) + (current || 0)
    );
  }

  function renderMessage(message: string) {
    return (
      <tr>
        <td>{message}</td>
      </tr>
    );
  }
}
