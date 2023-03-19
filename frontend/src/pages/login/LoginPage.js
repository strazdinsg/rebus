import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import "./LoginPage.css";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";

/**
 * Page shown when the user must log in.
 * @returns {JSX.Element}
 * @constructor
 */
export function LoginPage() {
  const [pinError, setPinError] = useState(false);
  const [pinHelperText, setPinHelperText] = useState("");
  const userContext = useContext(UserContext);

  return (
    <form id="login-form" onSubmit={tryLogin}>
      <div id="login-form-container">
        <TextField
          id="pin-input-field"
          label="PIN Code"
          placeholder="123456"
          type="number"
          error={pinError}
          helperText={pinHelperText}
        />
        <Button title="Join the Rebus" variant="contained" onClick={tryLogin}>
          Go!
        </Button>
      </div>
    </form>
  );

  function tryLogin(event) {
    if (event) {
      event.preventDefault();
    }

    const pin = document.getElementById("pin-input-field").value;
    let user = findUserBy(pin);

    setPinError(user == null);
    if (user != null) {
      userContext.setUser(user);
    } else {
      setPinHelperText("Invalid PIN");
    }
  }

  /**
   * Find the user by the PIN - send API call.
   * @param pin The PIN code for the user.
   * @return {{isAdmin: boolean, username: string}|null} The user or null if no user found.
   */
  function findUserBy(pin) {
    // TODO - send API calls to decide the real user
    switch (pin) {
      case "111111":
        return { username: "Team 1", isAdmin: false };
      case "222222":
        return { username: "Team 2", isAdmin: false };
      case "667667":
        return { username: "Admin", isAdmin: true };
      default:
        return null;
    }
  }
}
