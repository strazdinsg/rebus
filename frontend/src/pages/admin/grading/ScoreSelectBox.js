/**
 * Select box where the adin select score for a team, for a specific challenge
 * @param {number} maxScore Max score allowed in this challenge
 * @param {number} score The current score
 * @param {function} saveScore Callback function to call when a new score is selected
 * @return {JSX.Element}
 * @constructor
 */
export function ScoreSelectBox({ maxScore, score, saveScore }) {
  return (
    <select
      value={score != null && score > -1 ? score : -1}
      onChange={(event) => saveScore(event.target.value)}
    >
      {generateOptions()}
    </select>
  );

  function generateOptions() {
    const options = [<option key={-1} value={-1}></option>];
    for (let i = 0; i <= maxScore; ++i) {
      options.push(<option key={i}>{i}</option>);
    }
    return options;
  }
}
