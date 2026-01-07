import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followApi, useApiClient } from "@/utils/api";
import { User } from "@/types";

export const useFollow = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => followApi.followUser(api, userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["user", userId] });
      await queryClient.cancelQueries({ queryKey: ["follows"] });

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

      queryClient.setQueriesData(
        { queryKey: ["follows"] },
        (old: User[] | undefined) => {
          if (!old) return old;
          return old.map((user) =>
            user._id === userId
              ? { ...user, isFollowing: !user.isFollowing }
              : user
          );
        }
      );

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
      queryClient.invalidateQueries({ queryKey: ["follows"] });
    },
  });
};
