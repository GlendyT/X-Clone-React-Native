import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Post } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuotePost } from "@/hooks/useReposts";

interface QuoteModalProps {
  modalVisible: boolean;
  onClose: () => void;
  post: Post;
}

const QuoteModal = ({ modalVisible, onClose, post }: QuoteModalProps) => {
  const [content, setContent] = useState("");
  const { quotePost, isQuoting } = useQuotePost();

  const handleQuote = () => {
    if (!content.trim()) return;

    quotePost(post._id, content, {
      onSuccess: () => {
        setContent("");
        onClose();
      },
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-4 pt-2">
            {/**HEADER WITH BUTTONS */}
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity onPress={onClose}>
                <Text className="text-gray-900 text-lg">Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleQuote}
                disabled={!content.trim() || isQuoting}
                className={`px-4 py-2 rounded-full ${!content.trim() || isQuoting ? "bg-blue-300" : "bg-[#1DA1F2]"}`}
              >
                {isQuoting ? (
                  <ActivityIndicator size={"small"} color={"white"} />
                ) : (
                  <Text className="text-white font-bold">Post</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row">
              <View className="flex-1">
                <TextInput
                  className="text-lg text-gray-900 mb-4 min-h-[100px]"
                  placeholder="Add a comment..."
                  placeholderTextColor={"#657786"}
                  multiline
                  value={content}
                  onChangeText={setContent}
                  autoFocus
                  textAlignVertical="top"
                />

                {/*Preview del Post Original */}
                <View className="border border-gray-200 rounded-2xl p-3 overflow-hidden">
                  <View className="flex-row items-center mb-2">
                    <Image
                      source={{ uri: post.user.profilePicture }}
                      className="w-5 h-5 rounded-full mr-2"
                    />
                    <Text className="font-bold text-gray-900 text-sm mr-1">
                      {post.user.firstName} {post.user.lastName}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      @{post.user.username}
                    </Text>
                  </View>

                  {post.content && (
                    <Text
                      className="text-gray-900 text-sm mb-2"
                      numberOfLines={3}
                    >
                      {post.content}
                    </Text>
                  )}

                  {post.image && (
                    <Image
                      source={{ uri: post.image }}
                      className="w-full h-40 rounded-xl"
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default QuoteModal;
