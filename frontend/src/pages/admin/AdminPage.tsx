import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { GradingPage } from "./grading/GradingPage";
import { MainAppBar } from "../../components/MainAppBar";

/**
 * Page for admin user.
 */
export function AdminPage() {
  const userContext = useContext(UserContext);
  if (userContext.user) {
    return (
      <>
        <MainAppBar
          title={`Admin Dashboard for ${userContext.user.name}`}
        ></MainAppBar>
        <GradingPage />
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
