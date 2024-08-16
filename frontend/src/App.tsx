import { LoginPage } from "./pages/login/LoginPage";
import { ThemeProvider } from "@mui/material";
import { muiTheme } from "./MuiTheme";
import { UserContext } from "./context/UserContext";
import React, { useState } from "react";
import { AdminPage } from "./pages/admin/AdminPage";
import { BrowserRouter as Router } from "react-router-dom";
import { getAuthenticatedUser } from "./tools/authentication";
import { UserPage } from "./pages/user/UserPage";

/**
 * The main application wrapper.
 */
function App() {
  const [user, setUser] = useState(getAuthenticatedUser());

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
