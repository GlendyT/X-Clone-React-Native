import { View, Text, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useLikedPosts } from "@/hooks/useLikedPosts";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import { Post } from "@/types";
import PostCard from "./PostCard";
import CommentsModal from "./CommentsModal";

interface LikesListProps {
  username: string;
}

const LikesList = ({ username }: LikesListProps) => {
  const {
    data: likedPosts,
    isLoading,
    error,
  } = useLikedPosts(username);
  const { currentUser } = useCurrentUser();
  const { toggleLike, deletePost, checkIsLiked } = usePosts();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = selectedPostId
    ? likedPosts.find((p: Post) => p._id === selectedPostId)
    : null;

  if (isLoading ) {
    return (
      <View className="p-8 items-center">
        <ActivityIndicator size={"large"} color={"#1DA1F2"} />
        <Text className="text-gray-500 mt-2">Loading liked posts</Text>
      </View>
    );
  }

  if (error) {
    console.error("LikesList error:", error);
    return (
      <View className="p-8 items-center ">
        <Text className="text-gray-500">Failed to load liked posts</Text>
      </View>
    );
  }

  if (!likedPosts || likedPosts.length === 0) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500">No liked posts yet</Text>
      </View>
    );
  }

  return (
    <>
      {likedPosts.map((post: Post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={toggleLike}
          onDelete={deletePost}
          onComment={(post: Post) => setSelectedPostId(post._id)}
          currentUser={currentUser}
          isLiked={checkIsLiked(post.likes, currentUser)}
        />
      ))}

      <CommentsModal
        selectedPost={selectedPost}
        onClose={() => setSelectedPostId(null)}
      />
    </>
  );
};

export default LikesList;
