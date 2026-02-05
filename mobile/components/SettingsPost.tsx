import { Alert, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useEffect, useMemo } from "react";
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@/hooks/useThemeContext";
import { Post, User } from "@/types";

interface SettingsPostProps {
  onClose: () => void;
  post: Post;
  onDelete: (postId: string) => void;
  currentUser: User;
}

const SettingsPost = ({
  onClose,
  post,
  onDelete,
  currentUser,
}: SettingsPostProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["45%", "50%"], []);
  const { theme } = useTheme();
  const displayPost =
    post.isRepost && post.originalPost ? post.originalPost : post;
  const isOwnPost = displayPost.user._id === currentUser._id;

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      onClose();
    }
  };

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

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={{
        backgroundColor: theme === "dark" ? "#1a1a1a" : "white",
      }}
      handleIndicatorStyle={{
        backgroundColor: theme === "dark" ? "white" : "black",
      }}
    >
      <BottomSheetView className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}
          >
            Configuraciones
          </Text>
        </View>
        <View className="flex-1 gap-4">
          <TouchableOpacity className="flex-row items-center w-full gap-2 border-b border-gray-400 pb-3">
            <Entypo name="emoji-sad" size={24} color="gray" />

            <Text className="text-gray-400">Not interested in this post</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center w-full gap-2">
            <SimpleLineIcons name="user-follow" size={24} color="gray" />
            <Text className="text-gray-400">Follow user</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center w-full gap-2">
            <MaterialIcons name="playlist-add" size={24} color="gray" />
            <Text className="text-gray-400">Add/Remove from Lists</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center w-full gap-2">
            <Octicons name="mute" size={24} color="gray" />
            <Text className="text-gray-400">Mute user</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center w-full gap-2">
            <Entypo name="block" size={24} color="gray" />
            <Text className="text-gray-400">Block usert</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center w-full gap-2 border-b border-gray-400 pb-3">
            <MaterialIcons name="report-gmailerrorred" size={24} color="gray" />
            <Text className="text-gray-400">Report postt</Text>
          </TouchableOpacity>
        </View>
        {isOwnPost && (
          <View className="flex-1 gap-6">
            <TouchableOpacity
              onPress={handleDelete}
              className="flex-row items-center w-full gap-2"
            >
              <Octicons name="pin" size={24} color="gray" />
              <Text className="text-gray-400">Unpin from profilet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="flex-row items-center w-full gap-2"
            >
              <Feather name="trash" size={20} color="#afa3a7" />
              <Text className="text-gray-400">Delete post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="flex-row items-center w-full gap-2"
            >
              <MaterialCommunityIcons
                name="message-reply-outline"
                size={24}
                color="gray"
              />
              <Text className="text-gray-400">Change who can reply</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          onPress={handleDelete}
          className="flex-row items-center w-full gap-2"
        >
          <Ionicons name="megaphone-outline" size={24} color="gray" />
          <Text className="text-gray-400">Request Community Note</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
export default SettingsPost;
