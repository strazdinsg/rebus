import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import "./LoginPage.css";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { sendAuthenticationRequest } from "../../tools/authentication";

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
    sendAuthenticationRequest(pin, onLoginSuccess, onLoginError);
  }

  function onLoginSuccess(user) {
    userContext.setUser(user);
  }

  const HTTP_CODE_UNAUTHORIZED = 403;

  function onLoginError(code, message) {
    console.log(`Error ${code}: ${message}`);
    let errorMessage =
      "Something wrong with the server, contact the Rebus organizer!";
    if (code === HTTP_CODE_UNAUTHORIZED) {
      errorMessage = "Wrong PIN";
    }

    setPinError(true);
    setPinHelperText(errorMessage);
  }
}
