import { ChallengeChoiceButton } from "./ChallengeChoiceButton";
import "./ChallengePicker.css";
import { UserSession } from "../../../context/UserContext";

/**
 * Props for the ChallengePicker component.
 */
type ChallengePickerProps = {
  user: UserSession | null;
  challengeIds: number[];
  answered: number[];
  pending: boolean;
  error: boolean;
  /**
   * Callback when a challenge is picked.
   * @param challengeId The ID of the challenge that was picked.
   */
  onPick: (challengeId: number) => void;
};

/**
 * Component for selecting a challenge.
 * @constructor
 */
export function ChallengePicker(props: ChallengePickerProps) {
  if (!props.user || props.pending) {
    return <p>Loading...</p>;
  }

  if (props.error) {
    return <p>Data error, contact the developer</p>;
  }

  if (!props.challengeIds || props.challengeIds.length === 0) {
    return <p>No challenges found</p>;
  }

  return (
    <>
      <h2>Choose a challenge</h2>
      <div id="challenge-container">
        {props.challengeIds.map((challengeId, index) => (
          <ChallengeChoiceButton
            challengeId={challengeId}
            answered={isAnswered(challengeId)}
            key={index}
            onClick={props.onPick}
          />
        ))}
      </div>
    </>
  );

  function isAnswered(challengeId: number) {
    return props.answered.includes(challengeId);
  }
}
