import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { dataURItoFile } from "../tools/imageTools";
import { apiV1AxiosClient } from "../api-v1/apiClient";

/**
 * Query for getting the image for a challenge.
 * @param imageUrl URL of the image
 */
export function useImage(imageUrl: string | null) {
  return useQuery(
    {
      queryKey: ["image", imageUrl],
      queryFn: () => {
        if (imageUrl == null) {
          console.log(`null image, no query`);
          return Promise.reject("No image URL");
        }

        console.log(`querying image: ${imageUrl}`);
        // Here we can't use orval directly, because it handles the response type incorrectly
        return apiV1AxiosClient<Blob>({
          url: imageUrl,
          method: "GET",
          responseType: "blob",
        });
      },
      retry: false,
      enabled: imageUrl != null,
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
    },
    queryClient
  );
}
