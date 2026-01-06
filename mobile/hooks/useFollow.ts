import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followApi, useApiClient } from "@/utils/api";

export const useFollow = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => followApi.followUser(api, userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["user", userId] });

      const previousUser = queryClient.getQueryData(["user", userId]);

      queryClient.setQueryData(["user", userId], (old: any) => {
        if (!old) return old;
        const isFollowing = !old.isFollowing;
        return {
          ...old,
          isFollowing,
          followersCount: isFollowing
            ? (old.followersCount || 0) + 1
            : (old.followersCount || 0) - 1,
        };
      });

      return { previousUser };
    },
    onError: (err, userId, context) => {
      console.log("Error following user:", err);
      if (context?.previousUser) {
        queryClient.setQueryData(["user", userId], context.previousUser);
      }
    },
    onSettled: (_, __, userId) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
