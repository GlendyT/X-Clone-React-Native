import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { User } from "@/types";
import { useRouter } from "expo-router";
import { useFollow } from "@/hooks/useFollow";
import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "@/utils/api";
import { useTheme } from "@/hooks/useThemeContext";

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
  const { theme } = useTheme();

  const isFollowing = user?.isFollowing;

  const { mutate: followUser, isPending: isFollowPending } = useFollow();
  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 border-b border-gray-800  ${theme === "dark" ? "bg-black" : "bg-white"} `}
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
          <Text
            className={`font-bold   ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}
          >
            {user.firstName} {user.lastName}
          </Text>
        </View>
        <Text
          className={` text-sm  ${theme === "dark" ? "text-gray-500" : "text-gray-900"}`}
        >
          @{user.username}{" "}
        </Text>
        {user.bio ? (
          <Text
            className={` text-sm mt-1  ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}
            numberOfLines={1}
          >
            {user.bio}
          </Text>
        ) : null}
      </View>
      {currentUser?._id !== user._id ? (
        <TouchableOpacity
          onPress={() => followUser(user._id)}
          disabled={isFollowPending}
          className={`px-6 py-2 rounded-full border ${isFollowing ? "bg-black border-gray-500" : " border-gray-300 bg-white"}`}
        >
          <Text
            className={`font-semibold ${isFollowing ? "text-white border " : "text-gray-900"}`}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

export default ListFollows;
