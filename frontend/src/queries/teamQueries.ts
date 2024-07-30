import { useQuery } from "@tanstack/react-query";
import { apiGetTeams } from "../tools/api";
import { queryClient } from "./queryClient";

// Define a React Query hook for fetching teams
export function useTeams() {
  return useQuery(
    {
      queryKey: ["teams"],
      queryFn: async () => await apiGetTeams(),
    },
    queryClient
  );
}
