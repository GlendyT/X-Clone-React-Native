import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "@/utils/api";

export const useUserById = (id: string) => {
  const api = useApiClient();

  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.getUserById(api, id).then((res) => res.data),
    enabled: !!id,
  });
};
