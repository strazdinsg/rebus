import { renderHook, screen, waitFor } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from "@tanstack/react-query";
import { ReactNode } from "react";

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
    wrapper: createWrapper(),
  });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

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
