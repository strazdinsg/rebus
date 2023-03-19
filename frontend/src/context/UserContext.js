import { createContext } from "react";

/**
 * Store the logged-in user here.
 *
 * @type {React.Context<{user, setUser}>}
 */
export const UserContext = createContext({
  user: null,
  setUser: function () {},
});
