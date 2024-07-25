import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

/**
 * The headings for the grading table
 */
export function GradingTableHeader() {
  const challenges = useSelector(
    (state: RootState) => state.challengeStore.challenges
  );
  return (
    <thead>
      <tr>
        <th>
          Team <br />
          (total score)
        </th>
        {challenges.map((c) => (
          <th key={c.id}>Challenge {c.id}</th>
        ))}
      </tr>
    </thead>
  );
}
