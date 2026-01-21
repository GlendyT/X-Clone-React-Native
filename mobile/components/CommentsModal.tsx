import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Post } from "@/types";
import { useComments } from "@/hooks/useComments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import CommentItem from "./CommentItem";
import { useTheme } from "@/hooks/useThemeContext";

interface CommentsModalProps {
  selectedPost: Post | null;
  onClose: () => void;
}

const CommentsModal = ({ selectedPost, onClose }: CommentsModalProps) => {
  const {
    commentText,
    setCommentText,
    createComment,
    isCreatingComment,
    deleteComment,
    toggleLikeComment,
    createReply,
    isCreatingReply,
  } = useComments();
  const { currentUser } = useCurrentUser();
  const { theme } = useTheme();

  const handleClose = () => {
    onClose();
    setCommentText("");
  };

  if (!currentUser) {
    return null; // o un loading spinner
  }

  return (
    <Modal
      visible={!!selectedPost}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      {/*MODAL HEADER */}
      <View
        className={`flex-row items-center justify-between px-4 py-3 border-b  ${theme === "dark" ? "bg-black border-gray-800" : "bg-white border-gray-100"}`}
      >
        <TouchableOpacity onPress={handleClose}>
          <Text className="text-blue-500 text-lg"> close</Text>
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Comments</Text>
        <View className="w-12" />
      </View>

      {selectedPost && (
        <ScrollView
          className={`flex-1 ${theme === "dark" ? "bg-black" : "bg-white"}`}
        >
          <View className={`border-b border-gray-100  p-4`}>
            <View className="flex-row">
              <Image
                source={{ uri: selectedPost.user.profilePicture }}
                className="size-12 rounded-full mr-3"
              />

              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text
                    className={`font-bold  mr-1 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                  >
                    {selectedPost.user.firstName} {selectedPost.user.lastName}
                  </Text>
                  <Text className="text-gray-500 ml-1">
                    @{selectedPost.user.username}
                  </Text>
                </View>

                {selectedPost.content && (
                  <Text
                    className={`${theme === "dark" ? "text-gray-300" : "text-gray-900"} text-base leading-5 mb-3`}
                  >
                    {selectedPost.content}
                  </Text>
                )}

                {selectedPost.image && (
                  <Image
                    source={{ uri: selectedPost.image }}
                    className="w-full h-48 rounded-2xl mb-3"
                    resizeMode="cover"
                  />
                )}
              </View>
            </View>
          </View>

          {/*COMMENTS LIST */}

          {selectedPost.comments?.map((comment) => {
            return (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUser={currentUser}
                postUserId={selectedPost.user._id}
                onDelete={deleteComment}
                onToggleLike={toggleLikeComment}
                onReply={createReply}
                isCreatingReply={isCreatingReply}
              />
            );
          })}

          {/*ADD COMMENT INPUT */}
          <View className={`p-4 border-t ${theme === "dark" ? "border-gray-950" : "border-gray-100"}`}>
            <View className="flex-row">
              <Image
                source={{ uri: currentUser?.profilePicture || "" }}
                className="size-10 rounded-full mr-3"
              />

              <View className="flex-1">
                <TextInput
                  className="border border-gray-400 rounded-lg p-3 text-balance mb-3"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor={"#657786"}
                />

                <TouchableOpacity
                  className={`px-4 py-2 rounded-lg self-start ${commentText.trim() ? "bg-blue-500" : "bg-gray-300"}`}
                  onPress={() => createComment(selectedPost._id)}
                  disabled={isCreatingComment || !commentText.trim()}
                >
                  {isCreatingComment ? (
                    <ActivityIndicator size={"small"} color={"white"} />
                  ) : (
                    <Text
                      className={`font-semibold ${commentText.trim() ? "text-white" : "text-gray-500"}`}
                    >
                      Reply
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Modal>
  );
};

export default CommentsModal;
