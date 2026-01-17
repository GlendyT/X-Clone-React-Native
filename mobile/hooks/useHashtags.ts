import { Post } from "@/types";
import { postApi, useApiClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useHashtags = (hashtag: string | undefined | string[]) => {
  const api = useApiClient();

  const { data, isLoading, error, refetch, isRefetching } = useQuery<{
    posts: Post[];
  }>({
    queryKey: ["posts", "hashtag", hashtag],
    queryFn: () =>
      postApi
        .searchPostsByHashtag(api, hashtag as string)
        .then((res) => res.data),
    enabled: !!hashtag && typeof hashtag === "string",
  });

  return {
    posts: data?.posts || [],
    isLoading,
    error,
    refetch,
    isRefetching,
  };
};
