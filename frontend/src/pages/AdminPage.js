import { useContext } from "react";
import { UserContext } from "../context/UserContext";

/**
 * Page for admin user.
 * @return {JSX.Element}
 * @constructor
 */
export function AdminPage() {
  const userContext = useContext(UserContext);
  return <h1>Dashboard for {userContext.user.username}</h1>;
}
