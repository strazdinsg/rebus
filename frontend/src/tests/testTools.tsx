import { renderHook, screen, waitFor } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from "@tanstack/react-query";
import { ReactNode } from "react";
import { UserContext, UserSession } from "../context/UserContext";
import { BrowserRouter } from "react-router-dom";

/**
 * Expects the app bar to have the given text
 * @param title The text to expect
 */
export function expectAppBarText(title: string) {
  const header = screen.getByText(title, { selector: "h5" });
  expect(header).toBeInTheDocument();
}

/**
 * Expects the login page to be shown
 */
export function expectLoginPage() {
  const pinInputField = screen.getByLabelText("PIN Code");
  expect(pinInputField).toBeInTheDocument();
  expect(screen.getByText("Go!")).toBeInTheDocument();
}

/**
 * Awaits for a specific query to be resolved.
 * @param queryCreator A function that creates the query
 */
export async function waitForQueryToSettle(queryCreator: () => UseQueryResult) {
  const { result } = renderHook(queryCreator, {
    wrapper: queryClientWrapper,
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
}

export const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function queryClientWrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Wraps the given children in several mock components needed for testing.
 * @param children The child components to wrap
 * @param user The user session to use
 * @param useRouter When true, the children are wrapped in a BrowserRouter
 */
export function TestMockWrapper({
  children,
  user,
  useRouter,
}: {
  children: ReactNode;
  user: UserSession | null;
  useRouter?: boolean;
}) {
  const content = (
    <UserContext.Provider value={{ user: user, setUser: vi.fn() }}>
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    </UserContext.Provider>
  );

  if (useRouter) {
    return <BrowserRouter>{content}</BrowserRouter>;
  } else {
    return content;
  }
}

/**
 * A regular user session.
 */
export const regularUser = {
  id: 1,
  name: "John Doe",
  roles: ["ROLE_USER"],
  isAdmin: false,
};

/**
 * An admin user session.
 */
export const adminUser = {
  id: 2,
  name: "Ady Miny",
  roles: ["ROLE_ADMIN"],
  isAdmin: true,
};
