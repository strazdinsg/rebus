import { Button } from "@mui/material";

/**
 * A button for choosing one specific challenge.
 * @param challenge The challenge this button represents
 * @param index The index of the challenge, will be shown on the button
 * @return {JSX.Element}
 * @constructor
 */
export function ChallengeChoiceButton({ challenge, setSelectedChallenge }) {
  const checkmark = challenge.submitted ? "✔" : "";
  const buttonVariant = challenge.submitted ? "contained" : "outlined";
  return (
    <Button
      variant={buttonVariant}
      onClick={() => setSelectedChallenge(challenge)}
    >
      {challenge.id + " " + checkmark}
    </Button>
  );
}
