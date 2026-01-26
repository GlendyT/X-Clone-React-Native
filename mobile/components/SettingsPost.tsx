import { Alert, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useEffect, useMemo } from "react";
import { Feather } from "@expo/vector-icons";
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
  const snapPoints = useMemo(() => ["25%", "50%"], []);
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
        <Text
          className={`${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}
        >
          Opciones del post
        </Text>
        {isOwnPost && (
          <TouchableOpacity onPress={handleDelete}>
            <Feather name="trash" size={20} color={"#657786"} />
            <Text>Delete post</Text>
          </TouchableOpacity>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};
export default SettingsPost;
