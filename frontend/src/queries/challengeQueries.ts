import { useQuery } from "@tanstack/react-query";
import { apiGetChallenges } from "../tools/api";
import { queryClient } from "./queryClient";

/**
 * Query for getting all challenges.
 */
export function useChallenges() {
  return useQuery(
    {
      queryKey: ["challenges"],
      queryFn: async () => await apiGetChallenges(),
    },
    queryClient
  );
}
