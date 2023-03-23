import "./AnswerPage.css";
import { useParams } from "react-router-dom";

/**
 * A page where the team can submit an answer for one specific challenge.
 * @returns {JSX.Element}
 * @constructor
 */
export function AnswerPage(props) {
  const { challengeId } = useParams();

  return (
    <main>
      <h1>Challenge {challengeId}</h1>
      <p>TODO - challenge.question</p>
      <label>
        Your answer:
        <input type="text" placeholder="Chuck McDuck" />
      </label>
      <br />
      <label className="image-upload" for="image-upload"></label>
      <input
        type="file"
        id="image-upload"
        name="answer-image"
        accept="image/*"
        title="Upload image"
      />
      <br />
      <input type="submit" value="Send" />
    </main>
  );
}
