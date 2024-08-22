import { useMutation } from "@tanstack/react-query";
import { dataURItoFile } from "../tools/imageTools";
import { apiV1AxiosClient } from "../api-v1/apiClient";

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
  return useMutation({
    mutationFn: async (imageData: string) => {
      const picture = dataURItoFile(imageData, "image.jpeg");
      // Here we can't use orval directly, because it does not support multipart/form-data
      const formData = new FormData();
      formData.append("fileContent", picture);

      return apiV1AxiosClient<string>({
        url: `/pictures/${challengeId}/${userId}`,
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      });
    },
    onSuccess: onSuccess,
    onError: onError,
  });
}
