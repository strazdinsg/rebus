import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { useChallenges } from "../../../queries/challengeQueries";
import { useMyAnswers } from "../../../queries/answerQueries";
import { ChallengePicker } from "./ChallengePicker";
import { useNavigate } from "react-router-dom";
import { MainAppBar } from "../../../components/MainAppBar";

/**
 * Dashboard for regular users, showing a listing of available challenges.
 */
export function UserDashboard() {
  const userContext = useContext(UserContext);
  const challengeQuery = useChallenges();
  const myAnswerQuery = useMyAnswers();
  const navigate = useNavigate();

  const challenges = challengeQuery.data ? challengeQuery.data.data : [];
  const myAnswers = myAnswerQuery.data?.data?.answers || [];

  if (!userContext.user) {
    return <p>Error: not logged in!</p>;
  }

  return (
    <>
      <MainAppBar title={userContext.user.name}></MainAppBar>
      <main>
        <ChallengePicker
          pending={challengeQuery.isPending || myAnswerQuery.isPending}
          error={!!(challengeQuery.error || myAnswerQuery.error)}
          challengeIds={challenges.map((challenge) => challenge.id)}
          answered={myAnswers.map((answer) => answer.challengeId)}
          user={userContext.user}
          onPick={onChallengePicked}
        />
      </main>
    </>
  );

  function onChallengePicked(challengeId: number) {
    navigate("/answer/" + challengeId);
  }
}
