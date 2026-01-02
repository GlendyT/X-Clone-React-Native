import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUserById } from "@/hooks/useUserById";
import { Feather } from "@expo/vector-icons";
import PostsList from "@/components/PostsList";
import { usePosts } from "@/hooks/usePosts";
import { userApi, useApiClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useFollow } from "@/hooks/useFollow";
import ProfileLayout from "@/components/ProfileLayout";
import { SafeAreaView } from "react-native-safe-area-context";

const UserProfile = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const api = useApiClient();
  const {
    data: user,
    isLoading,
    isLoading: isRefetching,
    error,
  } = useUserById(id as string);

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => userApi.getCurrentUser(api).then((res) => res.data.user),
  });

  const isFollowing = user?.followers?.includes(currentUser?._id);

  const { mutate: followUser, isPending: isFollowPending } = useFollow();

  const { refetch: refetchPosts } = usePosts(user?.username || "");

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={"large"} color={"#1DA1F2"} />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-red-500 font-bold mb-2">
          Error loading profile
        </Text>
        <Text className="text-gray-500">
          {error?.message || "Unknown error"}
        </Text>
      </View>
    );
  }

  return (
    <ProfileLayout
      user={user}
      isRefetching={isRefetching}
      onRefresh={() => {
        refetchPosts();
      }}
      headerLeft={
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={"black"} />
        </TouchableOpacity>
      }
      actionButton={
        currentUser?._id !== user._id ? (
          <TouchableOpacity
            onPress={() => followUser(user._id)}
            disabled={isFollowPending}
            className={`px-6 py-2 rounded-full ${isFollowing ? "bg-black" : "border border-gray-300 bg-white"}`}
          >
            <Text
              className={`font-semibold ${isFollowing ? "text-white" : "text-gray-900"}`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        ) : null
      }
    >
      {user?.username ? (
        <PostsList username={user?.username} />
      ) : (
        <View>
          <Text>Loading user posts</Text>
        </View>
      )}
    </ProfileLayout>
  );
};

export default UserProfile;
