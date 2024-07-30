import { useQuery } from "@tanstack/react-query";
import { apiGetChallenges } from "../tools/api";
import { queryClient } from "./queryClient";

// Define a React Query hook for fetching challenges
export function useChallenges() {
  return useQuery(
    {
      queryKey: ["challenges"],
      queryFn: async () => await apiGetChallenges(),
    },
    queryClient
  );
}
