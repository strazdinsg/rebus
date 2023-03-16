/**
 * Page where the admin can see all the teams, add, edit and delete teams.
 * @returns {JSX.Element}
 * @constructor
 */
export function TeamPage() {
  const teams = [
    { name: "Team A", pin: 123456 },
    { name: "Team B", pin: 789012 },
    { name: "Team C", pin: 345678 },
  ];
  return (
    <main>
      <h1>Teams</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>PIN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr>
              <td>{team.name}</td>
              <td>{team.pin}</td>
              <td>Edit Delete</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button>Create new</button>
    </main>
  );
}
