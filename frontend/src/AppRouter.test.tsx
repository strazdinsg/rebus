import { render, screen } from "@testing-library/react";
import { AppRouter } from "./AppRouter";
import { UserContext, UserSession } from "./context/UserContext";

/**
 * Component tests for the AppRouter component.
 */
describe("AppRouter", () => {
  it("App shows login page by default", () => {
    renderComponent(null);
    expectLoginPage();
  });

  it("App shows user page for regular user", () => {
    renderComponent(regularUser);
    expectUserPageAppBar();
  });

  it("App shows Admin dashboard for admin user", () => {
    renderComponent(adminUser);
    expectAdminPageAppBar();
  });

  const regularUser = {
    id: 1,
    name: "John Doe",
    roles: ["ROLE_USER"],
    isAdmin: false,
  };

  const adminUser = {
    id: 2,
    name: "Ady Miny",
    roles: ["ROLE_ADMIN"],
    isAdmin: true,
  };

  function renderComponent(user: UserSession | null) {
    render(
      <UserContext.Provider value={{ user: user, setUser: vi.fn() }}>
        <AppRouter />
      </UserContext.Provider>
    );
  }

  function expectUserPageAppBar() {
    expectAppBarText(regularUser.name);
  }

  function expectAdminPageAppBar() {
    expectAppBarText(`Admin Dashboard for ${adminUser.name}`);
  }

  function expectAppBarText(name: string) {
    const header = screen.getByText(name, { selector: "h5" });
    expect(header).toBeInTheDocument();
  }

  function expectLoginPage() {
    const pinInputField = screen.getByLabelText("PIN Code");
    expect(pinInputField).toBeInTheDocument();
    expect(screen.getByText("Go!")).toBeInTheDocument();
  }
});
