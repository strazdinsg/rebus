import { useSelector } from "react-redux";

/**
 * One row in the grading table - for one team
 * @param team The team represented in the row
 * @return {JSX.Element}
 * @constructor
 */
export function GradingTableRow({ team }) {
  const challenges = useSelector((state) => state.challengeStore.challenges);
  const allAnswers = useSelector((state) => state.answerStore.allAnswers);
  const teamAnswers = allAnswers === null ? null : getTeamAnswers();

  return (
    <tr>
      <td>{team.name}</td>
      {challenges.map((challenge, index) => (
        <td key={index}>
          {getAnswerForChallenge(challenge.id)}
          {/*<ScoreSelectBox />*/}
        </td>
      ))}
    </tr>
  );

  function getTeamAnswers() {
    const teamAnswers = allAnswers.find((answer) => answer.teamId === team.id);
    return teamAnswers || null;
  }

  function getAnswerForChallenge(challengeId) {
    if (teamAnswers === null) {
      return null;
    }
    const answer = teamAnswers.answers[challengeId - 1];
    if (answer === null) return null;

    return <p>{answer}</p>;
  }
}
