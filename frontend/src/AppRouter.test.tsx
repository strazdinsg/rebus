import { render } from "@testing-library/react";
import { AppRouter } from "./AppRouter";
import { UserContext, UserSession } from "./context/UserContext";
import {
  adminUser,
  expectAppBarText,
  expectLoginPage,
  regularUser,
  testQueryClient,
} from "./tests/testTools";
import { QueryClientProvider } from "@tanstack/react-query";

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
      <UserContext.Provider value={{ user: user, setUser: vi.fn() }}>
        <QueryClientProvider client={testQueryClient}>
          <AppRouter />
        </QueryClientProvider>
      </UserContext.Provider>
    );
  }

  function expectUserPageAppBar() {
    expectAppBarText(regularUser.name);
  }

  function expectAdminPageAppBar() {
    expectAppBarText(`Admin Dashboard for ${adminUser.name}`);
  }
});
