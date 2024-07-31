import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { apiGetImage, apiUploadPicture } from "../tools/api";
import { dataURItoFile } from "../tools/imageTools";

/**
 * Query for getting the image for a challenge.
 * @param challengeId ID of the challenge
 * @param userId ID of the user
 */
export function useImage(challengeId: number, userId: number) {
  return useQuery(
    {
      queryKey: [`images/${challengeId}/${userId}`],
      queryFn: () => apiGetImage(challengeId, userId),
      retry: false,
    },
    queryClient
  );
}

/**
 * React Query mutation hook for uploading an image for a challenge.
 * @param challengeId ID of the challenge
 * @param userId ID of the user (team)
 * @param onSuccess Callback to call when the image is successfully uploaded
 * @param onError Callback to call when the image upload fails
 */
export function useUploadImage(
  challengeId: number,
  userId: number,
  onSuccess: () => void,
  onError: () => void
) {
  return useMutation(
    {
      mutationFn: async (imageData: string) => {
        const picture = dataURItoFile(imageData, "image.jpeg");
        await apiUploadPicture(challengeId, userId, picture);
      },
      onSuccess: onSuccess,
      onError: onError,
    },
    queryClient
  );
}
