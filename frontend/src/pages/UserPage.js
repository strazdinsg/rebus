import { useState } from "react";
import "./user/UserPage.css";
import { AnswerPage } from "./user/answer/AnswerPage";
import { UserDashboard } from "./user/UserDashboard";

/**
 * The page for a regular non-admin user (team)
 * @return {JSX.Element}
 * @constructor
 */
export function UserPage() {
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  return selectedChallenge != null ? (
    <AnswerPage challenge={selectedChallenge} />
  ) : (
    <UserDashboard setSelectedChallenge={setSelectedChallenge} />
  );
}
