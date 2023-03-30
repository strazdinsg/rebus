import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { apiGetAllAnswers, apiGetTeams } from "../../../tools/api";
import { setTeams } from "../../../redux/teamSlice";
import { GradingTableHeader } from "./GradingTableHeader";
import { GradingTableRow } from "./GradingTableRow";
import { setAllAnswers } from "../../../redux/answerSlice";
import "./GradingPage.css";

/**
 * Page where the admin can assign score to each challenge of each team.
 * @returns {JSX.Element}
 * @constructor
 */
export function GradingPage() {
  const teams = useSelector((state) => state.teamStore.teams);
  const dispatch = useDispatch();

  useEffect(() => {
    apiGetTeams()
      .then((teams) => dispatch(setTeams(teams)))
      .catch((error) => console.error(error));

    apiGetAllAnswers()
      .then((answers) => dispatch(setAllAnswers(answers)))
      .catch((error) => console.log(error));
  }, [dispatch]);

  return (
    <table cellSpacing="0">
      <GradingTableHeader />
      <tbody>
        {teams.map((team, index) => (
          <GradingTableRow team={team} key={index} />
        ))}
      </tbody>
    </table>
  );
}
