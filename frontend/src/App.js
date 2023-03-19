import { LoginPage } from "./pages/login/LoginPage";
import { ThemeProvider } from "@mui/material";
import { muiTheme } from "./MuiTheme";
import { UserContext } from "./context/UserContext";
import { useState } from "react";
import { UserPage } from "./pages/UserPage";
import { AdminPage } from "./pages/AdminPage";

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
        {user && user.isAdmin ? (
          <AdminPage />
        ) : user && !user.isAdmin ? (
          <UserPage />
        ) : (
          <LoginPage />
        )}
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
