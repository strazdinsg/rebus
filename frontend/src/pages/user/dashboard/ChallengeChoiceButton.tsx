import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ChallengeDto } from "../../../api-v2/models";

// Properties of the challenge button
type ChallengeChoiceButtonProps = {
  challenge: ChallengeDto; // The challenge this button represents
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
      data-testid={getButtonId(props.challenge.id)}
      variant={buttonVariant}
      onClick={() => navigate("/answer/" + props.challenge.id)}
    >
      {props.challenge.id + " " + checkmark}
    </Button>
  );
}

/**
 * Returns the id of the button for the given challenge.
 * Can be used to identify the button in tests.
 *
 * @param challengeId The id of the challenge
 */
export function getButtonId(challengeId: number) {
  return "challenge-" + challengeId;
}
