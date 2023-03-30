/**
 * Select box where the adin select score for a team, for a specific challenge
 * @param maxScore Max score allowed in this challenge
 * @return {JSX.Element}
 * @constructor
 */
export function ScoreSelectBox({ maxScore, saveScore }) {
  return (
    <select onChange={(event) => saveScore(event.target.value)}>
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
