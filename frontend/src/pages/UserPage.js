import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { AppBar, Toolbar, Typography } from "@mui/material";
import "./user/UserPage.css";
import { ChallengeChoiceButton } from "./user/ChallengeChoiceButton";

// TODO - load challenges from backend
const challenges = [
  { submitted: false },
  { submitted: false },
  { submitted: true },
  { submitted: false },
  { submitted: true },
];

/**
 * The main page for a regular non-admin user (team)
 * @return {JSX.Element}
 * @constructor
 */
export function UserPage() {
  const userContext = useContext(UserContext);
  const user = userContext.user;

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">{user.username}</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <h2>Choose a challenge</h2>
        <div id="challenge-container">
          {challenges.map((challenge, index) => (
            <ChallengeChoiceButton challenge={challenge} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
