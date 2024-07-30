import { useEffect } from "react";
import { apiGetAllAnswers } from "../../../tools/api";
import { GradingTableHeader } from "./GradingTableHeader";
import { GradingTableRow } from "./GradingTableRow";
import { setAllAnswers } from "../../../redux/answerSlice";
import "./GradingPage.css";
import { useTeams } from "../../../queries/teamQueries";
import { useDispatch } from "react-redux";

/**
 * Page where the admin can assign score to each challenge of each team.
 */
export function GradingPage() {
  const { isPending, error, data: teams } = useTeams();
  const dispatch = useDispatch();

  useEffect(() => {
    apiGetAllAnswers()
      .then((answers) => dispatch(setAllAnswers(answers)))
      .catch((error) => console.log(error));
  }, [dispatch]);

  if (error) {
    return <main>Could not load teams, contact the developer</main>;
  }

  let content;

  if (isPending) {
    content = <main>Loading teams...</main>;
  } else if (teams) {
    content = teams.map((team, index) => (
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
}
