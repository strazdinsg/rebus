import { useParams } from "react-router-dom";
import { AnswerPage } from "./AnswerPage";

/**
 * A component which reads the challenge ID from the URL and passes it to the AnswerPage component.
 * @constructor
 */
export function AnswerPageRouter() {
  const { challengeId } = useParams();
  const challengeIdNum = challengeId ? parseInt(challengeId) : 0;
  return challengeIdNum ? (
    <AnswerPage challengeId={challengeIdNum} />
  ) : (
    <main>Error: Challenge ID not found in URL</main>
  );
}
