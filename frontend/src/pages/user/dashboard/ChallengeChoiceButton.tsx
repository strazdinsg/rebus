import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GetChallenges200DataItem } from "../../../api-v2/models";
// import { ChallengeDto } from "schemas/src/challenge";

// Properties of the challenge button
type ChallengeChoiceButtonProps = {
  challenge: GetChallenges200DataItem; // The challenge this button represents
  submitted: boolean; // Is the user already answered this challenge?
};

/**
 * A button for choosing one specific challenge.
 */
export function ChallengeChoiceButton(props: ChallengeChoiceButtonProps) {
  const navigate = useNavigate();
  const checkmark = props.submitted ? "✔" : "";
  const buttonVariant = props.submitted ? "contained" : "outlined";
  return (
    <Button
      variant={buttonVariant}
      onClick={() => navigate("/answer/" + props.challenge.id)}
    >
      {props.challenge.id + " " + checkmark}
    </Button>
  );
}
