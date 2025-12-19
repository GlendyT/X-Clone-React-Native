import { useMutation, useQueryClient } from "@tanstack/react-query";
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
