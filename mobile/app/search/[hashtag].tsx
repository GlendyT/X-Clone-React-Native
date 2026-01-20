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
  const [currentHashtag, setCurrentHashtag] = useState(hashtag);
  const [showTrends, setShowTrends] = useState(false);

  const queryKey = ["posts", "hashtag", currentHashtag];

  const {
    posts,
    isLoading: isLoadingPosts,
    refetch,
    isRefetching,
  } = useHashtags(currentHashtag);

  const { trends, isLoadingTrends } = useTrends();
  const { toggleLike, deletePost } = usePostMutations(queryKey);
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();

  const selectedPost = selectedPostId
    ? posts.find((p: Post) => p._id === selectedPostId)
    : null;

  const handleLocalSearch = () => {
    if (!localSearchTerm.trim()) {
      setShowTrends(true);
      return;
    }
    const cleanTerm = localSearchTerm.replace("#", "").trim();
    if (cleanTerm) {
      setCurrentHashtag(cleanTerm);
      setShowTrends(false);
    }
  };

  useEffect(() => {
    setLocalSearchTerm(`#${hashtag}`);
    setCurrentHashtag(hashtag);
    setShowTrends(false);
  }, [hashtag]);

  const clearSearch = () => {
    setLocalSearchTerm("");
    setShowTrends(true);
  };

  if (isLoadingPosts || isLoadingUser || !currentUser) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={"large"} color={"#1DA1F2"} />
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
            placeholder={`Search X`}
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
      {/* CONTENT AREA */}
      {showTrends ? (
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Trends for you
          </Text>
          {isLoadingTrends ? (
            <ActivityIndicator size={"large"} color={"#1DA1F2"} className="mt-4" />
          ) : trends.length > 0 ? (
            trends.map((item) => (
              <TouchableOpacity
                key={item._id}
                className="py-3 border-b border-gray-100"
                onPress={() => {
                  const cleanTopic = item.topic.replace("#", "");
                  setLocalSearchTerm(item.topic);
                  setCurrentHashtag(cleanTopic);
                  setShowTrends(false);
                }}
              >
                <Text className="text-gray-500 text-sm">
                  Trending in your region
                </Text>
                <Text className="font-bold text-blue-500 text-lg">
                  {item.topic}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {item.postCount} posts
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-4">
              No trends found
            </Text>
          )}
        </View>
      ) : (
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
                No results found
              </Text>
            </View>
          )}
        />
      )}

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
