import { BrowserRouter as Router } from "react-router-dom";
import { AdminPage } from "../pages/admin/AdminPage";
import { UserPage } from "../pages/user/UserPage";
import { LoginPage } from "../pages/login/LoginPage";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

/**
 * Select the correct page based on the current user's role.
 * @constructor
 */
export function AppRouter() {
  const { user } = useContext(UserContext);

  return (
    <Router>
      {user && user.isAdmin ? (
        <AdminPage />
      ) : user && !user.isAdmin ? (
        <UserPage />
      ) : (
        <LoginPage />
      )}
    </Router>
  );
}
