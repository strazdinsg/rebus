import { LoginPage } from "./pages/login/LoginPage";
import { ThemeProvider } from "@mui/material";
import { muiTheme } from "./MuiTheme";
import { UserContext } from "./context/UserContext";
import { useEffect, useState } from "react";
import { AdminPage } from "./pages/admin/AdminPage";
import { BrowserRouter as Router } from "react-router-dom";
import { apiGetChallenges } from "./tools/api";
import { getAuthenticatedUser } from "./tools/authentication";
import { useDispatch } from "react-redux";
import { setChallenges } from "./redux/challengeSlice";
import { UserPage } from "./pages/user/UserPage";

/**
 * The main application wrapper.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
  const [user, setUser] = useState(getAuthenticatedUser());
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadGlobalApiData() {
      await fetchChallengesFromApi();
    }

    async function fetchChallengesFromApi() {
      const allChallenges = await apiGetChallenges();
      console.log("Challenges from API:");
      console.log(allChallenges);
      dispatch(setChallenges(allChallenges));
    }

    loadGlobalApiData().catch(console.error);
  }, [dispatch]);

  return (
    <ThemeProvider theme={muiTheme}>
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
        <Router>
          {user && user.isAdmin ? (
            <AdminPage />
          ) : user && !user.isAdmin ? (
            <UserPage />
          ) : (
            <LoginPage />
          )}
        </Router>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
