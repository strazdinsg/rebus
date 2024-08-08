import ScoreSelectBox from "./ScoreSelectBox";
import { useChallenges } from "../../../queries/challengeQueries";
import { useAllAnswers, useUpdateScore } from "../../../queries/answerQueries";
import { ShortTeamAnswerDto, TeamDto } from "../../../api-v1/models";
import { apiV1AxiosClient } from "../../../api-v1/apiClient";
import { useEffect } from "react";

/**
 * One row in the grading table - for one team
 */
export function GradingTableRow(props: { team: TeamDto }) {
  const challenges = useChallenges();
  const allAnswers = useAllAnswers();
  const updateScore = useUpdateScore();
  const userId: number = props.team.id;
  useEffect(() => {
    loadImages();
  }, [challenges, allAnswers]);

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

  const answerList = allAnswers.data.data || [];
  const teamAnswers = getTeamAnswers(answerList);
  const challengeList = challenges.data.data || [];

  return (
    <tr>
      <td>
        {props.team.name}
        <br />({getTotalScore()})
      </td>
      {challengeList.map((challenge, index) => (
        <td key={index}>
          <ScoreSelectBox
            score={getScoreForChallenge(challenge.id)}
            maxScore={challenge.maxScore}
            saveScore={(score: number | null) => saveScore(score, challenge.id)}
          />
          {getAnswerForChallenge(challenge.id)}
          <img
            className="team-photo"
            alt="User-submitted"
            id={getImageId(userId, challenge.id)}
          />
        </td>
      ))}
    </tr>
  );

  function getTeamAnswers(allAnswers: ShortTeamAnswerDto[]) {
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
    const answer = teamAnswers.answers
      ? teamAnswers.answers[challengeId - 1]
      : null;
    if (answer === null) return null;

    return <p>{answer}</p>;
  }

  function getScoreForChallenge(challengeId: number): number | null {
    if (teamAnswers === null) {
      return null;
    }
    return teamAnswers.scores ? teamAnswers.scores[challengeId - 1] : null;
  }

  function saveScore(score: number | null, challengeId: number) {
    updateScore.mutate({
      challengeId: challengeId,
      userId: userId,
      score: score,
    });
  }

  function getTotalScore() {
    if (!teamAnswers || !teamAnswers.scores) {
      return 0;
    }

    return teamAnswers.scores.reduce(
      (total, current) => (total || 0) + (current || 0)
    );
  }

  function renderMessage(message: string) {
    const cl = challenges.data?.data || [];
    const columnCount = cl ? cl.length + 1 : 2;
    return (
      <tr>
        <td colSpan={columnCount}>{message}</td>
      </tr>
    );
  }

  function getImageId(teamId: number, challengeId: number) {
    return `answer-img-${challengeId}-${teamId}`;
  }

  async function sleep(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async function loadImages() {
    console.log("Loading images...");
    const cl = challenges.data?.data || [];
    for (let challengeIndex in cl) {
      const challengeId = cl[challengeIndex].id;
      try {
        const imageBlob = await getImageFromBackend(challengeId);
        await sleep(500);
        showImage(imageBlob, challengeId);
      } catch (e) {
        console.log(
          `Image for challenge user ${userId}, ${challengeId} not found.`
        );
      }
    }
  }

  function showImage(imageBlob: Blob, challengeId: number) {
    const imageElement = document.getElementById(
      getImageId(props.team.id, challengeId)
    ) as HTMLImageElement;
    if (imageElement && imageBlob) {
      imageElement.src = URL.createObjectURL(imageBlob);
      imageElement.style.display = "block";
    } else {
      imageElement.style.display = "none";
    }
  }

  function getImageFromBackend(challengeId: number): Promise<Blob> {
    console.log(`getImageFromBackend ${challengeId}`);
    return apiV1AxiosClient<Blob>({
      url: `/pictures/${challengeId}/${userId}`,
      method: "GET",
      responseType: "blob",
    });
  }
}
