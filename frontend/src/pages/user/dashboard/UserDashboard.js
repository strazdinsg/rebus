import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ChallengeChoiceButton } from "./ChallengeChoiceButton";

/**
 * Dashboard for regular users, showing a listing of available challenges.
 * @param setSelectedChallenge A function to call to set the selected challenge
 * @return {JSX.Element}
 * @constructor
 */
export function UserDashboard({ setSelectedChallenge }) {
  const userContext = useContext(UserContext);
  const user = userContext.user;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">{user.username}</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <h2>Choose a challenge</h2>
        <div id="challenge-container">
          {challenges.map((challenge, index) => (
            <ChallengeChoiceButton
              challenge={challenge}
              setSelectedChallenge={setSelectedChallenge}
            />
          ))}
        </div>
      </main>
    </>
  );
}
