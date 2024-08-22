import { useQuery } from "@tanstack/react-query";
import { getAdminEndpoints } from "../api-v1/endpoints/admin-endpoints/admin-endpoints";

// Define a React Query hook for fetching teams
export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => await getAdminEndpoints().getAllTeams(),
  });
}
