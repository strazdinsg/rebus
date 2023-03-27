import { LoginPage } from "./pages/login/LoginPage";
import { ThemeProvider } from "@mui/material";
import { muiTheme } from "./MuiTheme";
import { UserContext } from "./context/UserContext";
import { useEffect, useState } from "react";
import { AdminPage } from "./pages/admin/AdminPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnswerPage } from "./pages/user/answer/AnswerPage";
import { UserDashboard } from "./pages/user/dashboard/UserDashboard";
import { ChallengeContext } from "./context/ChallengeContext";
import { apiGetChallenges } from "./tools/api";
import { getAuthenticatedUser } from "./tools/authentication";

/**
 * The main application wrapper.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
  const [challenges, setChallenges] = useState([]);
  const [user, setUser] = useState(getAuthenticatedUser());

  useEffect(fetchChallengesFromApi, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
        <ChallengeContext.Provider value={challenges}>
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
        </ChallengeContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
  );

  function fetchChallengesFromApi() {
    apiGetChallenges().then((responseText) => {
      const c = JSON.parse(responseText);
      console.log(c);
      setChallenges(c);
    });
  }
}

export default App;
