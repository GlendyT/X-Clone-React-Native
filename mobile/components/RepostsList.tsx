import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserReposts } from "@/hooks/useReposts";
import { usePosts } from "@/hooks/usePosts";
import { Post } from "@/types";
import { Feather } from "@expo/vector-icons";
import PostCard from "./PostCard";
import CommentsModal from "./CommentsModal";
import { useTheme } from "@/hooks/useThemeContext";

const RepostsList = ({ username }: { username: string }) => {
  const { currentUser } = useCurrentUser();
  const { theme } = useTheme();
  const { reposts, isLoading, error, refetch } = useUserReposts(username);
  const { toggleLike, deletePost, checkIsLiked } = usePosts();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = selectedPostId
    ? reposts.find((p: Post) => p.originalPost?._id === selectedPostId)
        ?.originalPost
    : null;

  if (isLoading) {
    return (
      <View className="p-8 items-center">
        <ActivityIndicator size={"large"} color={"#1DA1F2"} />
        <Text className="text-gray-500 mt-2"> Loading reposts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500 mb-4">Failed to load reposts</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => refetch()}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (reposts.length === 0) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500">No reposts yet</Text>
      </View>
    );
  }

  return (
    <>
      {reposts.map((repost: Post) => {
        const originalPost = repost.originalPost;
        if (!originalPost) {
          return null;
        }

        return (
          <View key={repost._id}>
            {/* Repost indicator */}
            <View
              className={`flex-row items-center px-4 pt-3 pb-1 ${theme === "dark" ? "bg-black" : "bg-white"}`}
            >
              <Feather name="repeat" size={16} color={"#657786"} />
              <Text
                className={`text-xs ml-3 font-bold  ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
              >
                {repost.user?._id === currentUser?._id
                  ? "You"
                  : `${repost.user.firstName || ""} ${repost.user.lastName || ""}`}{" "}
                reposted
              </Text>
            </View>

            {/* Original post */}
            {currentUser && (
              <>
                <PostCard
                  post={originalPost}
                  onLike={toggleLike}
                  onDelete={deletePost}
                  onComment={(post: Post) => setSelectedPostId(post._id)}
                  currentUser={currentUser}
                  isLiked={checkIsLiked(originalPost.likes, currentUser)}
                />
              </>
            )}
          </View>
        );
      })}

      <CommentsModal
        selectedPost={selectedPost}
        onClose={() => setSelectedPostId(null)}
      />
    </>
  );
};

export default RepostsList;
