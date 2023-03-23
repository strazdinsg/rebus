import { LoginPage } from "./pages/login/LoginPage";
import { ThemeProvider } from "@mui/material";
import { muiTheme } from "./MuiTheme";
import { UserContext } from "./context/UserContext";
import { useState } from "react";
import { UserPage } from "./pages/user/UserPage";
import { AdminPage } from "./pages/admin/AdminPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnswerPage } from "./pages/user/answer/AnswerPage";
import { UserDashboard } from "./pages/user/dashboard/UserDashboard";

/**
 * The main application wrapper.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
  const [user, setUser] = useState(null);
  return (
    <ThemeProvider theme={muiTheme}>
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
        <Router>
          {user && user.isAdmin ? (
            <AdminPage />
          ) : user && !user.isAdmin ? (
            <Routes>
              <Route path={"/"} element={<UserDashboard />} />
              <Route path={"/answer/:challengeId"} element={<AnswerPage />} />
            </Routes>
          ) : (
            <LoginPage />
          )}
        </Router>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
