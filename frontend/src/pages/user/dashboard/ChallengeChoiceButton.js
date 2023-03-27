import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * A button for choosing one specific challenge.
 * @param challenge The challenge this button represents
 * @param index The index of the challenge, will be shown on the button
 * @return {JSX.Element}
 * @constructor
 */
export function ChallengeChoiceButton({ challenge, submitted }) {
  const navigate = useNavigate();
  const checkmark = submitted ? "✔" : "";
  const buttonVariant = submitted ? "contained" : "outlined";
  return (
    <Button
      variant={buttonVariant}
      onClick={() => navigate("/answer/" + challenge.id)}
    >
      {challenge.id + " " + checkmark}
    </Button>
  );
}
