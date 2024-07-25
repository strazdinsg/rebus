import React from "react";

type ScoreSelectBoxProps = {
  maxScore: number;
  score: number | null;
  saveScore: (e: number | null) => void;
};

/**
 * Select box where the adin select score for a team, for a specific challenge
 */
const ScoreSelectBox: React.FC<ScoreSelectBoxProps> = ({
  maxScore,
  score,
  saveScore,
}) => {
  return (
    <select
      value={score != null && score > -1 ? score : -1}
      onChange={(event) => {
        let score: number | null = parseInt(event.target.value);
        if (score < 0) {
          score = null;
        }
        saveScore(score);
      }}
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
};

export default ScoreSelectBox;
