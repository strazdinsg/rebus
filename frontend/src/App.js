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

/**
 * The main application wrapper.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
  const [challenges, setChallenges] = useState([]);
  const [user, setUser] = useState(null);

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

// TODO - load challenges from backend
// function loadStaticChallenges() {
//   return [
//     {
//       id: 1,
//       question:
//         "I am something that everyone has, yet no one can see it. I am precious, but cannot be bought. I am light as a feather, yet can weigh a person down. What am I?",
//       submittedAnswer: "The breath",
//     },
//     {
//       id: 2,
//       question: "Second quest",
//       submittedAnswer: null,
//     },
//     { id: 3, question: "Another quest", submittedAnswer: null },
//     { id: 4, question: "Foursquare", submittedAnswer: "Random answer" },
//     { id: 5, question: "Pentagon", submittedAnswer: null },
//   ];
// }
