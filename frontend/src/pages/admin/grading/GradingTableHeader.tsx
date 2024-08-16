import React from "react";
import { useChallenges } from "../../../queries/challengeQueries";

/**
 * The headings for the grading table
 */
export function GradingTableHeader() {
  const { isPending, error, data: challenges } = useChallenges();
  if (isPending) {
    return renderMessage("Loading challenges...");
  }

  if (error) {
    return renderMessage("Could not load challenges, contact the developer");
  }

  if (!challenges) {
    return renderMessage("No challenges found");
  }

  const challengeList = challenges.data || [];

  return (
    <thead>
      <tr>
        <th>
          Team <br />
          (total score)
        </th>
        {challengeList.map((c) => (
          <th key={c.id}>Challenge {c.id}</th>
        ))}
      </tr>
    </thead>
  );
}

function renderMessage(message: string) {
  return (
    <thead>
      <tr>
        <th>{message}</th>
      </tr>
    </thead>
  );
}
