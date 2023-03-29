import { Route, Routes } from "react-router-dom";
import { UserDashboard } from "./dashboard/UserDashboard";
import { AnswerPage } from "./answer/AnswerPage";
import { useDispatch } from "react-redux";
import { setMyAnswers } from "../../redux/answerSlice";
import { useEffect } from "react";
import { apiGetMyAnswers } from "../../tools/api";

/**
 * Main page component for a regular user.
 * @return {JSX.Element}
 * @constructor
 */
export function UserPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadMyAnswers() {
      const ma = await apiGetMyAnswers();
      console.log("API Answers:");
      console.log(ma);
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
