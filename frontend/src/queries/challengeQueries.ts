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
      queryFn: async () => {
        const response = await apiGetChallenges();
        if (response.status === "SUCCESS") {
          return response.data;
        } else {
          throw new Error(response.message);
        }
      },
    },
    queryClient
  );
}
