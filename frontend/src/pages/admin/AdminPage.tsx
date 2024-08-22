import { UserSession } from "../../context/UserContext";
import { GradingPage } from "./grading/GradingPage";
import { MainAppBar } from "../../components/MainAppBar";

/**
 * Page for admin user.
 */
export function AdminPage(props: { user: UserSession }) {
  if (props.user) {
    return (
      <>
        <MainAppBar title={`Admin Dashboard for ${props.user.name}`} />
        <GradingPage />
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}
