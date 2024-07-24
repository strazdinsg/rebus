/**
 * A summary of all the results, for the admin.
 * @returns {JSX.Element}
 * @constructor
 */
export function ResultPage() {
  const challengeNumbers = [1, 2, 3, 4, 5];
  const teams = ["Team A", "Team B", "Team C"];

  return (
    <main>
      <h1>Results</h1>
      <table>
        <thead>
          <tr>
            <td>Team</td>
            {challengeNumbers.map((i) => (
              <td>Challenge {i}</td>
            ))}
            <td>Total</td>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr>
              <td>{team}</td>
              {challengeNumbers.map((i) => (
                <td>{i * 3}</td>
              ))}
              <td>{100 - index * 10}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
