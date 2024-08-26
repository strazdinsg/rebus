import { render } from "@testing-library/react";
import { AppRouter } from "./AppRouter";
import { UserSession } from "./context/UserContext";
import {
  adminUser,
  expectAppBarText,
  expectLoginPage,
  regularUser,
  TestMockWrapper,
} from "./tests/testTools";

/**
 * Component tests for the AppRouter component.
 */
describe("AppRouter", () => {
  it("App shows login page by default", () => {
    renderAppRouterFor(null);
    expectLoginPage();
  });

  it("App shows user page for regular user", () => {
    renderAppRouterFor(regularUser);
    expectUserPageAppBar();
  });

  it("App shows Admin dashboard for admin user", () => {
    renderAppRouterFor(adminUser);
    expectAdminPageAppBar();
  });

  function renderAppRouterFor(user: UserSession | null) {
    render(
      <TestMockWrapper user={user}>
        <AppRouter />
      </TestMockWrapper>
    );
  }

  function expectUserPageAppBar() {
    expectAppBarText(regularUser.name);
  }

  function expectAdminPageAppBar() {
    expectAppBarText(`Admin Dashboard for ${adminUser.name}`);
  }
});
