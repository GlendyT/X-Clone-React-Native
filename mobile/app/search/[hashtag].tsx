import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useHashtags } from "@/hooks/useHashtags";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Post } from "@/types";
import { usePostMutations } from "@/hooks/usePostMutations";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "@/components/PostCard";
import CommentsModal from "@/components/CommentsModal";
import { Feather } from "@expo/vector-icons";

const HashtagList = () => {
  const { hashtag } = useLocalSearchParams<{ hashtag: string }>();
  const router = useRouter();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const queryKey = ["posts", "hashtag", hashtag];

  const {
    posts,
    isLoading: isLoadingPosts,
    refetch,
    isRefetching,
  } = useHashtags(hashtag);

  const { toggleLike, deletePost } = usePostMutations(queryKey);
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();

  const selectedPost = selectedPostId
    ? posts.find((p: Post) => p._id === selectedPostId)
    : null;

  if (isLoadingPosts || isLoadingUser || !currentUser) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={"large"} color={"#1DA1F2"} />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500">No posts yet</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["top"]}>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 ">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Feather name="arrow-left" size={24} color={"#1DA1F2"} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-semibold text-blue-500">
            #{hashtag}
          </Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUser={currentUser}
            onLike={toggleLike}
            onDelete={deletePost}
            onComment={(post: Post) => setSelectedPostId(post._id)}
          />
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-gray-500 text-lg">
              No posts found for #{hashtag}
            </Text>
          </View>
        )}
      />

      {selectedPost && (
        <CommentsModal
          selectedPost={selectedPost}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </SafeAreaView>
  );
};

export default HashtagList;
