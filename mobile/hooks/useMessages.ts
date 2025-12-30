import { User } from "@/types";
import { conversationApi, useApiClient, userApi } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useConversations = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: conversations,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      try {
        const response = await conversationApi.getConversations(api);
        return response.data.conversations || [];
      } catch (error) {
        console.error("❌ Failed to fetch conversations:", error);
        return [];
      }
    },
  });

  const getOrCreateConversationMutation = useMutation({
    mutationFn: async (otherUserId: string) => {
      const response = await conversationApi.getOrCreateConversation(
        api,
        otherUserId
      );
      return response.data.conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to open conversation");
    },
  });

  const markedAsReadMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      await conversationApi.markAsRead(api, conversationId);
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      await conversationApi.deleteConversation(api, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to delete conversation");
    },
  });

  const deleteConversation = (conversationId: string) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation? All messages will be lost",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteConversationMutation.mutate(conversationId),
        },
      ]
    );
  };

  return {
    conversations: conversations || [],
    isLoading,
    error,
    refetch,
    getOrCreateConversation: (otherUserId: string) =>
      getOrCreateConversationMutation.mutateAsync(otherUserId),
    markAsRead: (conversationId: string) =>
      markedAsReadMutation.mutate(conversationId),
    deleteConversation,
    isCreatingConversation: getOrCreateConversationMutation.isPending,
  };
};

export const useMessages = (conversationId: string) => {
  const [messageText, setMessageText] = useState("");
  const [page, setPage] = useState(1);
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: messagesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages", conversationId, page],
    queryFn: async () => {
      const response = await conversationApi.getMessages(
        api,
        conversationId,
        page
      );
      return response.data;
    },
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await conversationApi.sendMessage(
        api,
        conversationId,
        content
      );
      return response.data.message;
    },
    onSuccess: () => {
      setMessageText("");
      // Refetch inmediato de mensajes
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      // Hacer refetch inmediato
      queryClient.refetchQueries({
        queryKey: ["messages", conversationId],
      });
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to send message. Try again");
    },
  });

  const sendMessage = () => {
    if (messageText.trim()) {
      sendMessageMutation.mutate(messageText.trim());
    }
  };

  const loadMoreMessages = () => {
    if (messagesData?.pagination?.hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return {
    messages: messagesData?.messages || [],
    pagination: messagesData?.pagination,
    isLoading,
    error,
    refetch,
    messageText,
    setMessageText,
    sendMessage,
    isSending: sendMessageMutation.isPending,
    loadMoreMessages,
    hasMoreMessages: messagesData?.pagination?.hasMore || false,
  };
};

export const useUserSearch = (searchText: string) => {
  const api = useApiClient();
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchText]);

  const { data: searchedUsers, isLoading: isSearching } = useQuery<User[]>({
    queryKey: ["userSearch", debouncedSearchText],
    queryFn: async () => {
      if (debouncedSearchText.trim() === "") {
        return [];
      }
      const response = await userApi.searchUsers(api, debouncedSearchText);
      return response.data;
    },
    enabled: debouncedSearchText.trim().length > 0,
  });

  return { searchedUsers: searchedUsers || [], isSearching };
};
