import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthenticatedUser } from "../tools/authentication";
import { getAdminEndpoints as adminEndpointsV1 } from "../api-v1/endpoints/admin-endpoints/admin-endpoints";
import { getAdminEndpoints as adminEndpointsV2 } from "../api-v2/endpoints/admin-endpoints/admin-endpoints";
import { getUserEndpoints } from "../api-v1/endpoints/user-endpoints/user-endpoints";

/**
 * React Query hook for getting all answers from the backend.
 */
export function useAllAnswers() {
  return useQuery({
    queryKey: ["allAnswers"],
    queryFn: async () => await adminEndpointsV2().getAllAnswers(),
  });
}

/**
 * React Query mutation hook for updating a score in the backend.
 * Arguments:
 *   - challengeId: ID of the challenge
 *   - userId: ID of the user (team)
 *   - score: The score. Null when score is deleted
 */
export function useUpdateScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: {
      challengeId: number;
      userId: number;
      score: number | null;
    }) =>
      await adminEndpointsV1().setScore(args.challengeId, args.userId, {
        score: args.score || undefined,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allAnswers"] });
    },
  });
}

/**
 * React Query hook for getting my answers (answers for the team).
 */
export function useMyAnswers() {
  return useQuery({
    queryKey: ["myAnswers"],
    queryFn: async () => await getUserEndpoints().getMyAnswers(),
  });
}

/**
 * React Query mutation hook for answering a challenge as the current user.
 * Arguments:
 *   - challengeId: ID of the challenge
 *   - userId: ID of the user (team)
 *   - answer: The answer
 *   - onSuccess: Callback to call when the answer is successfully saved
 *   - onError: Callback to call when the answer is not saved
 */
export function useUpdateMyAnswer(onSuccess: () => void, onError: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { challengeId: number; answer: string }) => {
      const user = getAuthenticatedUser();
      if (user) {
        await getUserEndpoints().postAnswer(args.challengeId, user.id, {
          answer: args.answer,
          challengeId: args.challengeId,
        });
      }
    },
    onSuccess: async () => {
      onSuccess();
      await queryClient.invalidateQueries({ queryKey: ["myAnswers"] });
    },
    onError: onError,
  });
}
