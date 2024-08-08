import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { getPublicEndpoints } from "../api-v2/endpoints/public-endpoints/public-endpoints";

/**
 * Query for getting all challenges.
 */
export function useChallenges() {
  return useQuery(
    {
      queryKey: ["challenges"],
      queryFn: async () => await getPublicEndpoints().getChallenges(),
    },
    queryClient
  );
}
