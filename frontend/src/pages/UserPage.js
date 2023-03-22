import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import "./UserPage.css";

// TODO - load challenges from backend
const challenges = [
  { submitted: false },
  { submitted: false },
  { submitted: true },
  { submitted: false },
  { submitted: true },
];

function MenuIcon() {
  return null;
}

/**
 * The main page for a regular non-admin user (team)
 * @return {JSX.Element}
 * @constructor
 */
export function UserPage() {
  const { user, setUser } = useContext(UserContext);

  return (
    <main>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4">{user.username}</Typography>
        </Toolbar>
      </AppBar>
      <h2>Choose a challenge</h2>
      <div id="challenge-container">
        {challenges.map((challenge, index) => (
          <Button variant={challenge.submitted ? "contained" : "outlined"}>
            {index + 1}
          </Button>
        ))}
      </div>
    </main>
  );
}
