import { Trend } from "@/types";
import { trendApi, useApiClient, postApi } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useTrends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
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

  // Buscar posts por hashtag para crear trends artificiales
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
  } = useQuery<Trend[]>({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      try {
        // Buscar posts por hashtag
        const response = await postApi.searchPostsByHashtag(api, searchTerm.trim().replace('#', ''));
        const posts = response.data;
        
        if (posts && posts.length > 0) {
          // Crear un trend artificial basado en los resultados
          return [{
            _id: `search-${searchTerm}`,
            topic: searchTerm.startsWith('#') ? searchTerm : `#${searchTerm}`,
            postCount: posts.length,
            region: 'Search Results'
          }];
        }
        return [];
      } catch (error) {
        console.error('Search error:', error);
        return [];
      }
    },
    enabled: hasSearched && !!searchTerm.trim(),
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
    setHasSearched(true);
    recordSearchMutation.mutate(searchTerm.trim());
  };

  const clearSearch = () => {
    setSearchTerm("");
    setHasSearched(false);
  };

  const displayTrends = hasSearched && searchTerm.trim() ? searchResults || [] : trends || [];
  const isLoading = hasSearched && searchTerm.trim() ? isLoadingSearch : isLoadingTrends;

  return {
    searchTerm,
    setSearchTerm,
    trends: displayTrends,
    isLoadingTrends: isLoading,
    handleSearchSubmit,
    refetchTrends,
    isRefetchingTrends,
    clearSearch,
    hasSearched,
  };
};
