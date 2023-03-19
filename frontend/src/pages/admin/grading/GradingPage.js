import { ScoreSelectBox } from "./ScoreSelectBox";

/**
 * Page where the admin can assign score to each challenge of each team.
 * @returns {JSX.Element}
 * @constructor
 */
export function GradingPage() {
  const challengeNumbers = [1, 2, 3, 4, 5];
  const teams = ["Team A", "Team B", "Team C"];
  return (
    <table>
      <thead>
        <tr>
          <th>Team</th>
          {challengeNumbers.map((i) => (
            <th>Challenge {i}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {teams.map((teamName) => (
          <tr>
            <td>{teamName}</td>
            {challengeNumbers.map((i) => (
              <td>
                12{" "}
                <img
                  src="https://picsum.photos/150/100"
                  alt="Graphical answer to the quiz"
                />
                <ScoreSelectBox />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
