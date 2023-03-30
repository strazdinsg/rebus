import { useSelector } from "react-redux";
import { ScoreSelectBox } from "./ScoreSelectBox";
import { useEffect } from "react";
import { apiGetImage } from "../../../tools/api";

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

  // Ignore the warning about dependencies
  // eslint-disable-next-line
  useEffect(loadImages, []);

  return (
    <tr>
      <td>{team.name}</td>
      {challenges.map((challenge, index) => (
        <td key={index}>
          <ScoreSelectBox maxScore={challenge.maxScore} />
          {getAnswerForChallenge(challenge.id)}
          <img
            className="team-photo"
            alt="User-submitted"
            id={getImageId(team.id, challenge.id)}
          />
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

  function loadImages() {
    console.log("Loading images...");
    for (let challengeIndex in challenges) {
      const challengeId = challenges[challengeIndex].id;
      apiGetImage(challengeId, team.id)
        .then((imageBlob) => showImage(imageBlob, challengeId))
        .catch((_) => {});
    }
  }

  function getImageId(teamId, challengeId) {
    return `answer-img-${challengeId}-${teamId}`;
  }

  function showImage(imageBlob, challengeId) {
    const imageElement = document.getElementById(
      getImageId(team.id, challengeId)
    );
    if (imageBlob) {
      imageElement.src = URL.createObjectURL(imageBlob);
      imageElement.style.display = "block";
    } else {
      imageElement.style.display = "none";
    }
  }
}
