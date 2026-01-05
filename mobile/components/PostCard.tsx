import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { Post, User } from "@/types";
import { formatDate, formatNumber } from "@/utils/formatters";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRepost } from "@/hooks/useReposts";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onComment: (post: Post) => void;
  isLiked?: boolean;
  currentUser: User;
}

const PostCard = ({
  post,
  onLike,
  onDelete,
  isLiked,
  currentUser,
  onComment,
}: PostCardProps) => {
  const displayPost =
    post.isRepost && post.originalPost ? post.originalPost : post;
  const isRepost = post.isRepost && post.originalPost;
  const isOwnPost = displayPost.user._id === currentUser._id;
  const { repost, isReposting } = useRepost();

  const hasReposted = useMemo(() => {
    const targetPost = isRepost ? post.originalPost : post;

    if (!targetPost) return false;
    const result =
      targetPost.repostedBy?.some((userOrId) => {
        if (typeof userOrId === "object" && userOrId._id) {
          return userOrId._id.toString() === currentUser._id.toString();
        }
        return userOrId.toString() === currentUser._id.toString();
      }) || false;
    return result;
  }, [post, currentUser._id, isRepost]);

  const router = useRouter();

  const handleDelete = () => {
    Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(post._id),
      },
    ]);
  };

  const handleProfilePress = () => {
    if (isOwnPost) {
      router.push("/(tabs)/profile");
    } else {
      router.push(`/profile/${displayPost.user._id}` as any);
    }
  };

  return (
    <View className="border-b border-gray-100 bg-white">
      {/*Mostrar indicador de repost */}
      {isRepost && (
        <View className="flex-row items-center px-4 mt-2">
          <Feather name="repeat" size={16} color={"#657786"} />
          <Text className="text-gray-500 text-sm ml-2">
            {post.user.firstName} {post.user.lastName} reposted
          </Text>
        </View>
      )}
      <View className="flex-row p-4">
        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={{ uri: displayPost.user.profilePicture || "" }}
            className="w-12 h-12 rounded-full mr-3"
          />
        </TouchableOpacity>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <TouchableOpacity
              onPress={handleProfilePress}
              className="flex-row items-center"
            >
              <Text className="font-bold text-gray-900 mr-1">
                {displayPost.user.firstName} {displayPost.user.lastName}
              </Text>

              <Text className="font-bold text-gray-500 ">
                @{displayPost.user.username} *{" "}
                {formatDate(displayPost.createdAt)}
              </Text>
            </TouchableOpacity>

            {isOwnPost && (
              <TouchableOpacity onPress={handleDelete}>
                <Feather name="trash" size={20} color={"#657786"} />
              </TouchableOpacity>
            )}
          </View>

          {displayPost.content && (
            <Text className="text-gray-900 text-base leading-5 mb-3">
              {displayPost.content}
            </Text>
          )}

          {displayPost.image && (
            <Image
              source={{ uri: displayPost.image }}
              className="w-full h-48 rounded-2xl mb-3"
              resizeMode="cover"
            />
          )}

          <View className="flex-row justify-between max-w-xs">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => onComment(displayPost)}
            >
              <Feather name="message-circle" size={18} color={"#657786"} />
              <Text className="text-gray-500 text-sm ml-2">
                {formatNumber(displayPost.comments?.length || 0)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => repost(displayPost._id)}
              disabled={isReposting}
            >
              <Feather
                name="repeat"
                size={18}
                color={hasReposted ? "#1DA1F2" : "#657786"}
              />
              <Text
                className={`text-sm ml-2 ${hasReposted ? "text-blue-500" : "text-gray-500"}`}
              >
                {formatNumber(displayPost.repostedBy?.length || 0)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => onLike(displayPost._id)}
            >
              {isLiked ? (
                <AntDesign name="heart" size={18} color={"#E0245E"} />
              ) : (
                <Feather name="heart" size={18} color={"#657786"} />
              )}

              <Text
                className={`text-sm ml-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}
              >
                {formatNumber(displayPost.likes.length || 0)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Feather name="share" size={18} color={"#657786"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
