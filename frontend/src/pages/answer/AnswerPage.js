import "./AnswerPage.css";

/**
 * A page where the team can submit an answer for one specific challenge.
 * @returns {JSX.Element}
 * @constructor
 */
export function AnswerPage() {
  return (
    <main>
      <h1>Challenge 1</h1>
      <p>
        I am something that everyone has, yet no one can see it. I am precious,
        but cannot be bought. I am light as a feather, yet can weigh a person
        down. What am I?
      </p>
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
