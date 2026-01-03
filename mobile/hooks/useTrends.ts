import { Trend } from "@/types";
import { trendApi, useApiClient } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useTrends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: trends,
    isLoading: isLoadingTrends,
    refetch: refetchTrends,
    isRefetching: isRefetchingTrends,
  } = useQuery<Trend[]>({
    queryKey: ["trends"],
    queryFn: async () => {
      const response = await trendApi.getTrends(api);
      return response.data;
    },
  });

  const recordSearchMutation = useMutation({
    mutationFn: (term: string) => trendApi.recordSearch(api, term),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trends"] });
    },
    onError: (error) => {
      console.error("Failed to record search:", error);
    },
  });

  const handleSearchSubmit = () => {
    if (!searchTerm.trim()) return;
    recordSearchMutation.mutate(searchTerm.trim());
  };

  return {
    searchTerm,
    setSearchTerm,
    trends: trends || [],
    isLoadingTrends,
    handleSearchSubmit,
    refetchTrends,
    isRefetchingTrends,
  };
};
