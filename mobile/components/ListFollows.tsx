import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { User } from "@/types";
import { useRouter } from "expo-router";
import { useFollow } from "@/hooks/useFollow";
import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "@/utils/api";

interface ListFollowsProps {
  user: User;
}

const ListFollows = ({ user }: ListFollowsProps) => {
  const router = useRouter();
  const api = useApiClient();
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => userApi.getCurrentUser(api).then((res) => res.data.user),
  });

  const isFollowing = user?.isFollowing;

  const { mutate: followUser, isPending: isFollowPending } = useFollow();
  return (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-100 bg-white"
      onPress={() => router.push(`/profile/${user._id}`)}
    >
      <Image
        source={{
          uri: user.profilePicture || "https://via.placeholder.com/150",
        }}
        className="w-12 h-12 rounded-full mr-3 bg-gray-200"
      />
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </Text>
        </View>
        <Text className="text-gray-500 text-sm">@{user.username} </Text>
        {user.bio ? (
          <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>
            {user.bio}
          </Text>
        ) : null}
      </View>
      {currentUser?._id !== user._id ? (
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
      ) : null}
    </TouchableOpacity>
  );
};

export default ListFollows;
