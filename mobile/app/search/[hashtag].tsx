import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useHashtags } from "@/hooks/useHashtags";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Post } from "@/types";
import { usePostMutations } from "@/hooks/usePostMutations";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "@/components/PostCard";
import CommentsModal from "@/components/CommentsModal";
import { Feather } from "@expo/vector-icons";
import { useTrends } from "@/hooks/useTrends";

const HashtagList = () => {
  const { hashtag } = useLocalSearchParams<{ hashtag: string }>();
  const router = useRouter();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(`#${hashtag}`);

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

  const handleLocalSearch = () => {
    if (!localSearchTerm.trim()) return;
    const cleanTerm = localSearchTerm.replace("#", "").trim();
    if (cleanTerm && cleanTerm !== hashtag) {
      router.push(`/search/${cleanTerm}`);
    }
  };

  useEffect(() => {
    setLocalSearchTerm(`#${hashtag}`);
  }, [hashtag]);

  const clearSearch = () => {
    setLocalSearchTerm("");
  };

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
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="px-4 py-3 border-b border-gray-100 flex-row items-center ">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Feather name="arrow-left" size={24} color={"#1DA1F2"} />
        </TouchableOpacity>
        <View className="w-full flex-row items-center justify-between bg-gray-100 rounded-full px-4 py-3">
          <TextInput
            className="w-auto ml-3 text-base"
            placeholderTextColor={"#657786"}
            value={localSearchTerm}
            onChangeText={setLocalSearchTerm}
            onSubmitEditing={handleLocalSearch}
            returnKeyType="search"
          />

          {localSearchTerm ? (
            <TouchableOpacity onPress={() => clearSearch()} className="mr-8">
              <Feather name="x" size={18} color={"#657786"} />
            </TouchableOpacity>
          ) : null}
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
