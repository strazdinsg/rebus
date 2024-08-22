import { Button } from "@mui/material";

/**
 * Properties of the challenge button.
 * @param challengeId The challenge this button represents
 * @param answered Has the user answered this challenge?
 * @param onClick Callback when the button is clicked
 */
type ChallengeChoiceButtonProps = {
  challengeId: number;
  answered: boolean;
  onClick: (challengeId: number) => void;
};

/**
 * A button for choosing one specific challenge.
 */
export function ChallengeChoiceButton(props: ChallengeChoiceButtonProps) {
  const checkmark = props.answered ? "✔" : "";
  const buttonVariant = props.answered ? "contained" : "outlined";
  return (
    <Button
      data-testid={getButtonId(props.challengeId)}
      variant={buttonVariant}
      onClick={() => props.onClick(props.challengeId)}
    >
      {props.challengeId + " " + checkmark}
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
