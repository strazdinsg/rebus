import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import "./LoginPage.css";
import { FormEvent, useContext, useState } from "react";
import { UserContext, UserSession } from "../../context/UserContext";
import { sendAuthenticationRequest } from "../../tools/authentication";

const HTTP_CODE_UNAUTHORIZED = 403;

/**
 * Page shown when the user must log in.
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

  function tryLogin(event: FormEvent) {
    if (event) {
      event.preventDefault();
    }

    const pinElement = document.getElementById(
      "pin-input-field"
    ) as HTMLInputElement;
    const pin = pinElement ? pinElement.value : "";
    if (pin) {
      sendAuthenticationRequest(pin, onLoginSuccess, onLoginError);
    }
  }

  function onLoginSuccess(user: UserSession) {
    userContext.setUser(user);
  }

  function onLoginError(code: number, message: string) {
    let errorMessage =
      "Something wrong with the server, contact the Rebus organizer!";
    if (code === HTTP_CODE_UNAUTHORIZED) {
      errorMessage = "Wrong PIN";
    }

    setPinError(true);
    setPinHelperText(errorMessage);
  }
}
