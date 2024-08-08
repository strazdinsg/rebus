import { GradingTableHeader } from "./GradingTableHeader";
import { GradingTableRow } from "./GradingTableRow";
import "./GradingPage.css";
import { useTeams } from "../../../queries/teamQueries";

/**
 * Page where the admin can assign score to each challenge of each team.
 */
export function GradingPage() {
  const { isPending, error, data: teams } = useTeams();

  if (error) {
    return showMessage("Could not load teams, contact the developer");
  }

  let content;

  if (isPending) {
    content = showMessage("Loading teams...");
  } else if (teams) {
    const teamList = teams.data || [];
    content = teamList.map((team, index) => (
      <GradingTableRow team={team} key={index} />
    ));
  } else {
    content = <main>No teams found</main>;
  }

  return (
    <table cellSpacing="0">
      <GradingTableHeader />
      <tbody>{content}</tbody>
    </table>
  );

  function showMessage(message: string) {
    return (
      <tr>
        <td>{message}</td>
      </tr>
    );
  }
}
