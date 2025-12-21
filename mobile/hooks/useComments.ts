import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { commentApi, useApiClient } from "@/utils/api";

export const useComments = () => {
  const [commentText, setCommentText] = useState("");
  const api = useApiClient();

  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }) => {
      const response = await commentApi.createComment(api, postId, content);
      return response.data;
    },

    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to post comment. Try again");
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      const response = await commentApi.createReply(api, commentId, content);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.refetchQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      Alert.alert("Error", "Failed to post reply. Try again");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await commentApi.deleteComment(api, commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to delete comment");
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await commentApi.toggleLikeComment(api, commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to like comment");
    },
  });

  const deleteComment = (commentId: string) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCommentMutation.mutate(commentId),
        },
      ]
    );
  };

  const toggleLikeComment = (commentId: string) => {
    toggleLikeMutation.mutate(commentId);
  };

  const createComment = (postId: string) => {
    if (!commentText.trim()) {
      Alert.alert("Empty Comment", "Please write something before posting!");
      return;
    }

    createCommentMutation.mutate({ postId, content: commentText.trim() });
  };

  const createReply = (commentId: string, content: string) => {
    if (!content.trim()) {
      Alert.alert("Empty reply", "Please write something before posting!");
      return;
    }
    createReplyMutation.mutate({ commentId, content: content.trim() });
  };

  return {
    commentText,
    setCommentText,
    createComment,
    isCreatingComment: createCommentMutation.isPending,
    createReply,
    isCreatingReply: createReplyMutation.isPending,
    deleteComment,
    isDeletingComment: deleteCommentMutation.isPending,
    toggleLikeComment,
  };
};
