import { jsx as _jsx } from "react/jsx-runtime";
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
 */
function App() {
    const [user, setUser] = useState(getAuthenticatedUser());
    const dispatch = useDispatch();
    useEffect(() => {
        async function fetchChallengesFromApi() {
            const allChallenges = await apiGetChallenges();
            dispatch(setChallenges(allChallenges));
        }
        fetchChallengesFromApi().catch(console.error);
    }, [dispatch]);
    return (_jsx(ThemeProvider, { theme: muiTheme, children: _jsx(UserContext.Provider, { value: { user: user, setUser: setUser }, children: _jsx(Router, { children: user && user.isAdmin ? (_jsx(AdminPage, {})) : user && !user.isAdmin ? (_jsx(UserPage, {})) : (_jsx(LoginPage, {})) }) }) }));
}
export default App;
