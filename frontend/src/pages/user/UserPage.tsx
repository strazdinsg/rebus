import { Route, Routes } from "react-router-dom";
import { UserDashboard } from "./dashboard/UserDashboard";
import { AnswerPage } from "./answer/AnswerPage";
import { useDispatch } from "react-redux";
import { setMyAnswers } from "../../redux/answerSlice";
import { useEffect } from "react";
import { apiGetMyAnswers, TeamAnswers } from "../../tools/api";

/**
 * Main page component for a regular user.
 */
export function UserPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadMyAnswers() {
      const ma: TeamAnswers = await apiGetMyAnswers();
      dispatch(setMyAnswers(ma.answers));
    }

    loadMyAnswers().catch(console.error);
  }, [dispatch]);

  return (
    <Routes>
      <Route path={"/"} element={<UserDashboard />} />
      <Route path={"/answer/:challengeId"} element={<AnswerPage />} />
    </Routes>
  );
}
