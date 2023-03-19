import { useContext } from "react";
import { UserContext } from "../context/UserContext";

/**
 * The main page for a regular non-admin user (team)
 * @return {JSX.Element}
 * @constructor
 */
export function UserPage() {
  const userContext = useContext(UserContext);
  return <h1>{userContext.user.username}</h1>;
}
