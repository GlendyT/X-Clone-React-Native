import { postApi, useApiClient } from "@/utils/api";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostMutations = (queryKeyToInvalidate: QueryKey) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.likePost(api, postId),
    onSuccess: () => {
      // Invalidar la caché específica del queryKey primero
      queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      // Luego invalidar todas las cachés generales
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.deletePost(api, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userReposts"] });
    },
  });

  return {
    toggleLike: (postId: string) => likePostMutation.mutate(postId),
    deletePost: (postId: string) => deletePostMutation.mutate(postId),
  };
};
