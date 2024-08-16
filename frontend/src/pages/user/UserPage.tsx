import React from "react";
import { Route, Routes } from "react-router-dom";
import { UserDashboard } from "./dashboard/UserDashboard";
import { AnswerPage } from "./answer/AnswerPage";

/**
 * Main page component for a regular user.
 */
export function UserPage() {
  return (
    <Routes>
      <Route path={"/"} element={<UserDashboard />} />
      <Route path={"/answer/:challengeId"} element={<AnswerPage />} />
    </Routes>
  );
}
