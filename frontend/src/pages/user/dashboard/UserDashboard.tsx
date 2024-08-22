import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { useChallenges } from "../../../queries/challengeQueries";
import { useMyAnswers } from "../../../queries/answerQueries";
import { ChallengePicker } from "../../../components/ChallengePicker";
import { convertQueryResult } from "../../../tools/queryTools";
import { type HttpResponseDtoTeamAnswerDto } from "../../../api-v1/models";
import { ChallengeDto, TeamAnswerDto } from "../../../api-v2/models";
import type { HttpResponseDtoChallengeDtoArray } from "../../../api-v2/models";
import { useNavigate } from "react-router-dom";

/**
 * Dashboard for regular users, showing a listing of available challenges.
 */
export function UserDashboard() {
  const userContext = useContext(UserContext);
  const challengeQuery = useChallenges();
  const myAnswerQuery = useMyAnswers();
  const navigate = useNavigate();

  const challenges = convertQueryResult<
    HttpResponseDtoChallengeDtoArray,
    ChallengeDto[]
  >(challengeQuery);
  const myAnswers = convertQueryResult<
    HttpResponseDtoTeamAnswerDto,
    TeamAnswerDto
  >(myAnswerQuery);

  return (
    <ChallengePicker
      challenges={challenges}
      myAnswers={myAnswers}
      user={userContext.user}
      onPick={onChallengePicked}
    />
  );

  function onChallengePicked(challengeId: number) {
    navigate("/answer/" + challengeId);
  }
}
