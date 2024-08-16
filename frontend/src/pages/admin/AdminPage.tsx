import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { GradingPage } from "./grading/GradingPage";

/**
 * Page for admin user.
 */
export function AdminPage() {
  const userContext = useContext(UserContext);
  if (userContext.user) {
    return (
      <>
        <h1>Dashboard for {userContext.user.name}</h1>
        <GradingPage />
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
