import { Post } from "@/types";
import { useMemo, useState } from "react";

export const usePostInteraction = (posts: Post[]) => {
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [settingsPostId, setSettingsPostId] = useState<string | null>(null);

  const handleCommentPress = (post: Post) => {
    setCommentPostId(post._id);
  };

  const handleSettingsPress = (postId: string) => {
    setSettingsPostId(postId);
  };

  const closeCommentsModal = () => {
    setCommentPostId(null);
  };

  const closeSettingsModal = () => {
    setSettingsPostId(null);
  };

  const postForComments = useMemo(
    () => (commentPostId ? posts.find((p) => p._id === commentPostId) || null : null),
    [posts, commentPostId],
  );

  const postForSettings = useMemo(
    () => (settingsPostId ? posts.find((p) => p._id === settingsPostId) || null : null),
    [posts, settingsPostId],
  );

  return {
    postForComments,
    postForSettings,
    handleCommentPress,
    handleSettingsPress,
    closeCommentsModal,
    closeSettingsModal,
  };
};
