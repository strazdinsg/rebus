import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ChallengeChoiceButton } from "./ChallengeChoiceButton";
import "./UserDashboard.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useChallenges } from "../../../queries/challengeQueries";

/**
 * Dashboard for regular users, showing a listing of available challenges.
 */
export function UserDashboard() {
  const userContext = useContext(UserContext);
  const user = userContext.user;
  const { isPending, error, data: challenges } = useChallenges();
  const myAnswers = useSelector(
    (state: RootState) => state.answerStore.myAnswers
  );

  if (!user || isPending) {
    return <main>Loading user data...</main>;
  }

  if (error) {
    return <main>Could not load challenges, contact the developer</main>;
  }

  if (!challenges) {
    return <main>No challenges found</main>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">{user.name}</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <h2>Choose a challenge</h2>
        <div id="challenge-container">
          {challenges.map((challenge, index) => (
            <ChallengeChoiceButton
              challenge={challenge}
              submitted={isAnswered(challenge.id)}
              key={index}
            />
          ))}
        </div>
      </main>
    </>
  );

  function isAnswered(challengeId: number) {
    let answerFound = false;
    let i = 0;
    if (myAnswers)
      while (!answerFound && i < myAnswers.length) {
        answerFound = myAnswers[i].challengeId === challengeId;
        i++;
      }
    return answerFound;
  }
}