import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { postApi, useApiClient } from "@/utils/api";

export const useRepost = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const repostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await postApi.repostPost(api, postId);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userReposts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });

      const message = data.message || "Action completed succesfully";
      Alert.alert("Success", message);
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Filed to repost. Please try again"
      );
    },
  });

  const repost = (postId: string) => {
    repostMutation.mutate(postId);
  };

  return {
    repost,
    isReposting: repostMutation.isPending,
  };
};

export const useQuotePost = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const quoteMutation = useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }) => {
      const response = await postApi.quotePost(api, postId, content);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      Alert.alert("Success", "Quote posted succesfully");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response.data.error || "Failed to quote post. Please try again"
      );
    },
  });

  const quotePost = (
    postId: string,
    content: string,
    options?: { onSuccess?: () => void }
  ) => {
    quoteMutation.mutate(
      { postId, content },
      {
        onSuccess: () => options?.onSuccess?.(),
      }
    );
  };

  return {
    quotePost,
    isQuoting: quoteMutation.isPending,
  };
};

export const useUserReposts = (username?: string) => {
  const api = useApiClient();

  const {
    data: repostsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userReposts", username],
    queryFn: () => {
      return postApi.getUserReposts(api, username!);
    },
    select: (response) => {
      return response.data.posts;
    },
    enabled: !!username,
  });

  return {
    reposts: repostsData || [],
    isLoading,
    error,
    refetch,
  };
};
