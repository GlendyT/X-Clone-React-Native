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
import { Feather, Ionicons } from "@expo/vector-icons";
import { formatNumber } from "@/utils/formatters";

interface CommentsModalProps {
  selectedPost: Post;
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
  } = useComments();
  const { currentUser } = useCurrentUser();

  const handleClose = () => {
    onClose();
    setCommentText("");
  };
  return (
    <Modal
      visible={!!selectedPost}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      {/*MODAL HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={handleClose}>
          <Text className="text-blue-500 text-lg"> close</Text>
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Comments</Text>
        <View className="w-12" />
      </View>

      {selectedPost && (
        <ScrollView className="flex-1">
          <View className="border-b border-gray-100 bg-white p-4">
            <View className="flex-row">
              <Image
                source={{ uri: selectedPost.user.profilePicture }}
                className="size-12 rounded-full mr-3"
              />

              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="font-bold text-gray-900 mr-1">
                    {selectedPost.user.firstName} {selectedPost.user.lastName}
                  </Text>
                  <Text className="text-gray-500 ml-1">
                    @{selectedPost.user.username}
                  </Text>
                </View>

                {selectedPost.content && (
                  <Text className="text-gray-900 text-base leading-5 mb-3">
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
          {selectedPost.comments?.map((comment) => (
            <View
              key={comment._id}
              className="border-b border-gray-100 bg-white p-4"
            >
              {selectedPost.comments && selectedPost.comments.length > 0 ? (
                <View className="flex-row">
                  <Image
                    source={{ uri: comment.user.profilePicture }}
                    className="w-10 h-10 rounded-full mr-3"
                  />

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center">
                        <Text className="font-bold text-gray-900 mr-1">
                          {comment.user.firstName} {comment.user.lastName}
                        </Text>
                        <Text className="text-gray-500 text-sm ml-1">
                          @{comment.user.username}
                        </Text>
                      </View>

                      {(comment.user._id === currentUser._id ||
                        selectedPost.user._id === currentUser?._id) && (
                        <TouchableOpacity
                          onPress={() => deleteComment(comment._id)}
                        >
                          <Feather name="trash" size={18} color={"#ef4444"} />
                        </TouchableOpacity>
                      )}
                    </View>

                    <Text className="text-gray-900 text-base leading-5 mb-2">
                      {comment.content}
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="p-4 text-center">
                  <Text className="text-gray-500 ">No comments yet</Text>
                </View>
              )}
              <View className="flex-row justify-between max-w-xs">
                <TouchableOpacity>
                  <Feather name="message-circle" size={18} color={"#657786"} />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center">
                  <Feather name="repeat" size={18} color={"#657786"} />
                  
                </TouchableOpacity>


                <TouchableOpacity
                 className="flex flex-row items-center gap-1"
                 onPress={() => toggleLikeComment(comment._id)}
                >

                  <Ionicons
                   name={comment.likes?.includes(currentUser?._id) ? "heart" : "heart-outline" } size={16} color={comment.likes?.includes(currentUser?._id) ? "#ef4444" : "#6b7280"}
                  />
                  {comment.likes.length > 0 && (
                    <Text className="text-xs text-gray-500 ml-1">
                      {comment.likes.length}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/*ADD COMMENT INPUT */}
          <View className="p-4 border-t border-gray-100">
            <View className="flex-row">
              <Image
                source={{ uri: currentUser.profilePicture }}
                className="size-10 rounded-full mr-3"
              />

              <View className="flex-1">
                <TextInput
                  className="border border-gray-200 rounded-lg p-3 text-balance mb-3"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
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
                      Replay
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
