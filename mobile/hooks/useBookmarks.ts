import { postApi, useApiClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useBookmarks = (username?: string) => {
  const api = useApiClient();

  return useQuery({
    queryKey: ["bookmarks", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await postApi.getUserBookmarks(api, username);
      return response.data.posts;
    },
    enabled: !!username,
  });
};
