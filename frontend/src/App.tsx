import { ThemeProvider } from "@mui/material";
import { muiTheme } from "./MuiTheme";
import { UserContext } from "./context/UserContext";
import { useState } from "react";
import { getAuthenticatedUser } from "./tools/authentication";
import { AppRouter } from "./AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

/**
 * The main application wrapper.
 */
function App() {
  const [user, setUser] = useState(getAuthenticatedUser());

  return (
    <ThemeProvider theme={muiTheme}>
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
        </QueryClientProvider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
