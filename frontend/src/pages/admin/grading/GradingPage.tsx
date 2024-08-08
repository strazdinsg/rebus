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
    const rows = teamList.map((team, index) => (
      <GradingTableRow team={team} key={index} />
    ));
    content = (
      <table cellSpacing="0">
        <GradingTableHeader />
        <tbody>{rows}</tbody>
      </table>
    );
  } else {
    content = showMessage("No teams found");
  }

  return content;

  function showMessage(message: string) {
    return (
      <main>
        <p>{message}</p>
      </main>
    );
  }
}
