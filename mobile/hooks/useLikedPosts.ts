import { postApi, useApiClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useLikedPosts = (username?: string) => {
  const api = useApiClient();

  return useQuery({
    queryKey: ["likedPosts", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await postApi.getUserLikedPosts(api, username);
      return response.data.posts;
    },
    enabled: !!username,
  });
};
