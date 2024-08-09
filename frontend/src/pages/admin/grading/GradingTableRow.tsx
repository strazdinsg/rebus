import ScoreSelectBox from "./ScoreSelectBox";
import { useChallenges } from "../../../queries/challengeQueries";
import { useAllAnswers, useUpdateScore } from "../../../queries/answerQueries";
import { TeamDto } from "../../../api-v1/models";
import { apiV1AxiosClient } from "../../../api-v1/apiClient";
import { useEffect } from "react";
import { AnswerDto, TeamAnswerDto } from "../../../api-v2/models";

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

  const answerList = allAnswers.data?.data || [];
  const teamAnswers = getTeamAnswers(answerList);
  const challengeList = challenges.data?.data || [];

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
          <p>{getAnswerForChallenge(challenge.id)?.answer || ""}</p>
          <img
            className="team-photo"
            alt="User-submitted"
            id={getImageId(userId, challenge.id)}
          />
        </td>
      ))}
    </tr>
  );

  function getTeamAnswers(allAnswers: TeamAnswerDto[]): TeamAnswerDto | null {
    if (allAnswers == null) return null;
    const teamAnswers = allAnswers.find(
      (answer) => answer.teamId === props.team.id
    );
    return teamAnswers || null;
  }

  function getAnswerForChallenge(challengeId: number): AnswerDto | null {
    if (teamAnswers === null) {
      return null;
    }
    const answer = teamAnswers.answers.find(
      (answer) => answer.challengeId === challengeId
    );
    return answer || null;
  }

  function getScoreForChallenge(challengeId: number): number | null {
    const answer = getAnswerForChallenge(challengeId);
    return answer?.score || null;
  }

  function saveScore(score: number | null, challengeId: number) {
    updateScore.mutate({
      challengeId: challengeId,
      userId: userId,
      score: score,
    });
  }

  function getTotalScore() {
    if (!teamAnswers?.answers) {
      return 0;
    }

    return teamAnswers.answers.reduce(
      (total, current) => (total || 0) + (current.score || 0),
      0
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
    if (!teamAnswers) return;

    for (let answer of teamAnswers.answers) {
      try {
        if (answer.imageUrl) {
          const imageBlob = await getImageFromBackend(answer.imageUrl);
          await sleep(500);
          showImage(imageBlob, answer.challengeId);
        }
      } catch (e) {}
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

  function getImageFromBackend(imageUrl: string): Promise<Blob> {
    return apiV1AxiosClient<Blob>({
      url: imageUrl,
      method: "GET",
      responseType: "blob",
    });
  }
}
