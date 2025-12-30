import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "@/utils/api";

export const useFollow = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userApi.followUser(api, userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
