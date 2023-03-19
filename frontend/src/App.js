import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginPage } from "./login/LoginPage";
import { Navigation } from "./Navigation";
import { GradingPage } from "./admin/grading/GradingPage";
import { TeamPage } from "./admin/team/TeamPage";
import { ResultPage } from "./admin/results/ResultPage";
import { GamePage } from "./game/GamePage";
import { AnswerPage } from "./answer/AnswerPage";
import { ThemeProvider } from "@mui/material";
import { muiTheme } from "./MuiTheme";

const user = null;

function MainPages() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/grading" element={<GradingPage />} />
        <Route path="/admin/teams" element={<TeamPage />} />
        <Route path="/admin/results" element={<ResultPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/answer" element={<AnswerPage />} />
      </Routes>
    </Router>
  );
}

/**
 * The main application wrapper.
 * @returns {JSX.Element}
 * @constructor
 */
function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      {user ? <MainPages /> : <LoginPage />}
    </ThemeProvider>
  );
}

export default App;
