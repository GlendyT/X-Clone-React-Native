import { Comment, User } from "@/types";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

interface CommentItemProps {
  comment: Comment;
  currentUser: User;
  postUserId: string;
  onDelete: (commentId: string) => void;
  onToggleLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  isCreatingReply: boolean;
}

const CommentItem = ({
  comment,
  currentUser,
  postUserId,
  onDelete,
  onToggleLike,
  onReply,
  isCreatingReply = false,
}: CommentItemProps) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  if (!currentUser) {
    return null;
  }

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment._id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  return (
    <View className="border-b border-gray-100 bg-white">
      {/*Comentario principal */}
      <View className="p-4">
        <View className="flex-row">
          <Image
            source={{ uri: comment.user.profilePicture }}
            className="w-10 h-10 rounded-full mr-3"
          />

          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center">
                <Text className="font-bold text-green-900 mr-1">
                  {comment.user.firstName} {comment.user.lastName}
                </Text>
                <Text className="text-gray-500 text-sm ml-1">
                  @{comment.user.username}
                </Text>
              </View>

              {(comment.user._id === currentUser._id ||
                postUserId === currentUser._id) && (
                <TouchableOpacity onPress={() => onDelete(comment._id)}>
                  <Feather name="trash" size={18} color={"#ef4444"} />
                </TouchableOpacity>
              )}
            </View>

            <Text className="text-gray-900 text-base leading-5 mb-2">
              {comment.content}
            </Text>

            <View className="flex-row items-center justify-between max-w-xs">
              <TouchableOpacity
                className="flex-row items-center gap-1"
                onPress={() => {
                  // En lugar de toggle, abre modal o navega
                  // Por ahora, solo muestra las respuestas si existen
                  if (comment.replies && comment.replies.length > 0) {
                    setShowReplies(!showReplies);
                  }
                }}
              >
                <Feather name="message-circle" size={18} color={"#657786"} />
                {comment.replies && comment.replies.length > 0 && (
                  <Text className="text-xs text-gray-500 ml-1">
                    {comment.replies.length}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-1"
                onPress={() => setShowReplyInput(!showReplyInput)}
              >
                <Feather name="corner-down-right" size={18} color={"#657786"} />
                <Text className="text-xs text-gray-500">Reply</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center">
                <Feather name="repeat" size={18} color={"#657786"} />
              </TouchableOpacity>

              <TouchableOpacity
                className=" flex-row items-center gap-1"
                onPress={() => onToggleLike(comment._id)}
              >
                <Ionicons
                  name={
                    comment.likes?.includes(currentUser._id)
                      ? "heart"
                      : "heart-outline"
                  }
                  size={16}
                  color={
                    comment.likes?.includes(currentUser._id)
                      ? "#ef4444"
                      : "#6b7280"
                  }
                />
                {comment.likes.length > 0 && (
                  <Text className="text-xs text-gray-500 ml-1">
                    {comment.likes.length}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/*Input para responded */}
        {showReplyInput && (
          <View className="mt-3 ml-13">
            <View className="flex-row">
              <Image
                source={{ uri: currentUser?.profilePicture || "" }}
                className="w-8 h-8 rounded-full mr-2"
              />
              <View className="flex-1">
                <TextInput
                  className="border border-gray-200 rounded-lg p-2 mb-2"
                  placeholder={`Reply to ${comment.user.firstName}...`}
                  value={replyText}
                  onChangeText={setReplyText}
                  multiline
                />
                <View className="flex-row">
                  <TouchableOpacity
                    className={`px-3 py-1 rounded mr-2 ${replyText.trim() ? "bg-blue-500" : "bg-gray-300"}`}
                    onPress={handleReply}
                    disabled={isCreatingReply || !replyText.trim()}
                  >
                    {isCreatingReply ? (
                      <ActivityIndicator size={"small"} color={"white"} />
                    ) : (
                      <Text
                        className={`text-sm ${replyText.trim() ? "text-white" : "text-gray-500"}`}
                      >
                        Reply
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-3 py-1"
                    onPress={() => {
                      setShowReplyInput(false);
                      setReplyText("");
                    }}
                  >
                    <Text className="text-gray-500 text-sm">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Respuestas anidadas */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <View className="ml-4 border-l border-gray-200 pl-4">
          {comment.replies
            .filter((reply) => {
              // Si es string, intentar obtener el comentario
              if (typeof reply === "string") {
                return false;
              }
              return reply && reply._id && reply.user;
            })
            .map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                currentUser={currentUser}
                postUserId={postUserId}
                onDelete={onDelete}
                onToggleLike={onToggleLike}
                onReply={onReply}
                isCreatingReply={isCreatingReply}
              />
            ))}
        </View>
      )}
    </View>
  );
};

export default CommentItem;
