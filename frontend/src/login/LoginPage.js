import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import "./LoginPage.css";
import { useState } from "react";

/**
 * Page shown when the user must log in.
 * @returns {JSX.Element}
 * @constructor
 */
export function LoginPage() {
  const [pinError, setPinError] = useState(false);
  const [pinHelperText, setPinHelperText] = useState("");
  return (
    <form id="login-form">
      <div id="login-form-container">
        <TextField
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

  function tryLogin() {
    // TODO
    setPinError(true);
    setPinHelperText("Invalid PIN");
  }
}
