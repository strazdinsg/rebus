import { createContext } from "react";

/**
 * Basic user session information.
 */
export type UserSession = {
  id: number; // User ID
  name: string; // User name
  roles: string[];
  isAdmin: boolean;
};

/**
 * Store the logged-in user here.
 */
export const UserContext = createContext<{
  user: UserSession | null;
  setUser: (user: UserSession) => void;
}>({
  user: null,
  setUser: function () {},
});
