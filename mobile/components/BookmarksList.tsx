import { View, Text, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import { Post } from "@/types";
import PostCard from "./PostCard";
import CommentsModal from "./CommentsModal";
import SettingsPost from "./SettingsPost";

const BookmarksList = ({ username }: { username?: string }) => {
  const { data: bookmarkedPosts, isLoading, error } = useBookmarks(username);
  const { currentUser } = useCurrentUser();
  const { toggleLike, deletePost, checkIsLiked } = usePosts();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [settingsPostId, setSettingsPostId] = useState<string | null>(null);

  const selectedPost = selectedPostId
    ? bookmarkedPosts.find((p: Post) => p._id === selectedPostId)
    : null;

  const settingsPost = settingsPostId
    ? bookmarkedPosts.find((p: Post) => p._id === settingsPostId)
    : null;

  if (isLoading) {
    return (
      <View className="p-8 items-center">
        <ActivityIndicator size={"large"} color={"#1DA1F2"} />
        <Text className="text-gray-500 mt-2">Loading bookmarked posts</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500">Failed to load bookmarked posts</Text>
      </View>
    );
  }

  if (!bookmarkedPosts || bookmarkedPosts.length === 0) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500">No bookmarked posts yet</Text>
      </View>
    );
  }

  return (
    <>
      {bookmarkedPosts.map((post: Post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={toggleLike}
          onDelete={deletePost}
          onComment={(post: Post) => setSelectedPostId(post._id)}
          onSettingsPress={(postId: string) => setSettingsPostId(postId)}
          currentUser={currentUser}
          isLiked={checkIsLiked(post.likes, currentUser)}
        />
      ))}

      <CommentsModal
        selectedPost={selectedPost}
        onClose={() => setSelectedPostId(null)}
      />

      {settingsPost && (
        <SettingsPost
          onClose={() => setSettingsPostId(null)}
          post={settingsPost}
          onDelete={deletePost}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

export default BookmarksList;
