import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AdminPage } from "../pages/admin/AdminPage";
import { LoginPage } from "../pages/login/LoginPage";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { UserDashboard } from "../pages/user/dashboard/UserDashboard";
import { AnswerPage } from "../pages/user/answer/AnswerPage";

/**
 * Select the correct page based on the current user's role.
 * @constructor
 */
export function AppRouter() {
  const { user } = useContext(UserContext);

  return (
    <>
      {user && user.isAdmin ? (
        <AdminPage user={user} />
      ) : user && !user.isAdmin ? (
        <Router>
          <Routes>
            <Route path={"/"} element={<UserDashboard />} />
            <Route path={"/answer/:challengeId"} element={<AnswerPage />} />
          </Routes>
        </Router>
      ) : (
        <LoginPage />
      )}
    </>
  );
}
