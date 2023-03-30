import { useSelector } from "react-redux";

/**
 * The headings for the grading table
 * @return {JSX.Element}
 * @constructor
 */
export function GradingTableHeader() {
  const challenges = useSelector((state) => state.challengeStore.challenges);
  return (
    <thead>
      <tr>
        <th>Team</th>
        {challenges.map((c) => (
          <th key={c.id}>Challenge {c.id}</th>
        ))}
      </tr>
    </thead>
  );
}
