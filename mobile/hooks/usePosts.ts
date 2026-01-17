import { useQuery } from "@tanstack/react-query";
import { useApiClient, postApi } from "@/utils/api";
import { usePostMutations } from "./usePostMutations";

export const usePosts = (username?: string) => {
  const api = useApiClient();
  const queryKey = username ? ["userPosts", username] : ["posts"];

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      username ? postApi.getUserPosts(api, username) : postApi.getPosts(api),
    select: (response) => response.data.posts,
  });

  // Log errors for debugging
  if (error) {
    console.error(" Posts fetch error:", error);
  }

  // const likePostMutation = useMutation({
  //   mutationFn: (postId: string) => postApi.likePost(api, postId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["posts"] });
  //     queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
  //     if (username) {
  //       queryClient.invalidateQueries({ queryKey: ["userPosts", username] });
  //     }
  //   },
  // });

  // const deletePostMutation = useMutation({
  //   mutationFn: (postId: string) => postApi.deletePost(api, postId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["posts"] });
  //     queryClient.invalidateQueries({ queryKey: ["likedPosts"] });
  //     queryClient.invalidateQueries({ queryKey: ["userReposts"] });
  //     if (username) {
  //       queryClient.invalidateQueries({ queryKey: ["userPosts", username] });
  //     }
  //   },
  // });

  const { toggleLike, deletePost } = usePostMutations(queryKey);
  const checkIsLiked = (postLikes: string[] | any[], currentUser: any) => {
    if (!currentUser || !currentUser._id || !postLikes || !Array.isArray(postLikes)) {
      return false;
    }
    const userId = currentUser._id;
    return postLikes.some((like) => {
      if (!like) return false;
      if (typeof like === "string") {
        return like === userId;
      }
      if (typeof like === "object" && like._id) {
        return like._id === userId;
      }
      return false;
    });
  };

  return {
    posts: postsData || [],
    isLoading,
    error,
    refetch,
    toggleLike,
    deletePost,
    checkIsLiked,
  };
};
