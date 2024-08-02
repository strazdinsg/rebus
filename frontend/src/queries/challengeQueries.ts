import { useQuery } from "@tanstack/react-query";
// import { apiGetChallenges } from "../tools/api";
import { queryClient } from "./queryClient";
import { getDefault } from "../api-v2/endpoints/default/default";

/**
 * Query for getting all challenges.
 */
export function useChallenges() {
  return useQuery(
    {
      queryKey: ["challenges"],
      queryFn: async () => await getDefault().getChallenges(),
    },
    queryClient
  );
}
