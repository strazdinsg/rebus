import { useMutation, useQuery } from "@tanstack/react-query";
import {
  apiGetAllAnswers,
  apiGetMyAnswers,
  apiPostAnswer,
  apiPostScore,
} from "../tools/api";
import { queryClient } from "./queryClient";
import { getAuthenticatedUser } from "../tools/authentication";

/**
 * React Query hook for getting all answers from the backend.
 */
export function useAllAnswers() {
  return useQuery(
    {
      queryKey: ["allAnswers"],
      queryFn: async () => await apiGetAllAnswers(),
    },
    queryClient
  );
}

/**
 * React Query mutation hook for updating a score in the backend.
 * Arguments:
 *   - challengeId: ID of the challenge
 *   - userId: ID of the user (team)
 *   - score: The score. Null when score is deleted
 */
export function useUpdateScore() {
  return useMutation(
    {
      mutationFn: async (args: {
        challengeId: number;
        userId: number;
        score: number | null;
      }) => await apiPostScore(args.challengeId, args.userId, args.score),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["allAnswers"] });
      },
    },
    queryClient
  );
}

/**
 * React Query hook for getting my answers (answers for the team).
 */
export function useMyAnswers() {
  return useQuery(
    {
      queryKey: ["myAnswers"],
      queryFn: async () => await apiGetMyAnswers(),
    },
    queryClient
  );
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
  return useMutation(
    {
      mutationFn: async (args: { challengeId: number; answer: string }) => {
        const user = getAuthenticatedUser();
        if (user) {
          await apiPostAnswer(args.challengeId, user.id, args.answer);
        }
      },
      onSuccess: async () => {
        onSuccess();
        await queryClient.invalidateQueries({ queryKey: ["allAnswers"] });
      },
      onError: onError,
    },
    queryClient
  );
}
