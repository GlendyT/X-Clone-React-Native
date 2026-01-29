import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/types";
import { useConversations, useMessages } from "@/hooks/useMessages";
import { formatDistanceToNow } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useUserById } from "@/hooks/useUserById";
import { Feather } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme } from "@/hooks/useThemeContext";

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const { data: otherUser, isLoading: isLoadingUser } = useUserById(
    id as string,
  );
  const {
    messages,
    messageText,
    setMessageText,
    sendMessage,
    isSending,
    loadMoreMessages,
    hasMoreMessages,
  } = useMessages(conversationId || "");

  const { markAsRead, getOrCreateConversation } = useConversations();

  useEffect(() => {
    const initConversation = async () => {
      try {
        setIsLoadingConversation(true);
        const conversation = await getOrCreateConversation(id as string);
        setConversationId(conversation._id);

        if (conversation.unreadCount > 0) {
          markAsRead(conversation._id);
        }
      } catch {
      } finally {
        setIsLoadingConversation(false);
      }
    };

    if (id) {
      initConversation();
    }
  }, [id]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd(true);
      }, 100);
    }
  }, [messages.length]);

  const handleSend = () => {
    sendMessage();
  };

  const getRelativeTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
        .replace("about", "")
        .replace("ago", "");
    } catch {
      return "";
    }
  };

  if (isLoadingUser || isLoadingConversation) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#1DA1F2"} />
          <Text className="text-gray-500 mt-4">Loading chat</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!otherUser) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          headerShown: false,
        }}
      />
      <SafeAreaView
        className={`flex-1  ${theme === "dark" ? "bg-black" : "bg-white"}`}
        edges={["top"]}
      >
        <View
          className={`flex-row items-center px-4 py-3 mb-4 border-b ${theme === "dark" ? "border-gray-600" : "border-gray-100"}`}
        >
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Feather name="arrow-left" size={24} color={"#1DA1F2"} />
          </TouchableOpacity>
          <Image
            source={{
              uri: otherUser.profilePicture || "",
            }}
            className="size-10 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text
              className={`font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
            >
              {otherUser.firstName} {otherUser.lastName}
            </Text>
            <Text className="text-gray-500 text-sm">@{otherUser.username}</Text>
          </View>
        </View>

        <View className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          >
            <ScrollView className="px-4">
              {hasMoreMessages && (
                <TouchableOpacity
                  onPress={loadMoreMessages}
                  className="items-center py-3 mb-4"
                >
                  <Text className="text-blue-500 text-sm">
                    Load older messages
                  </Text>
                </TouchableOpacity>
              )}

              {messages.length === 0 ? (
                <View className="flex-1 items-center justify-center py-10">
                  <Feather name="message-circle" size={48} color={"#E1E8ED"} />
                  <Text className="text-center text-gray-400 text-sm mt-4">
                    This is the beginning of your conversation with{" "}
                    {otherUser.firstName}
                  </Text>
                  <Text className="text-center text-gray-400 text-xs mt-2">
                    Send a message to start chatting
                  </Text>
                </View>
              ) : (
                <View>
                  {messages.map((message: Message) => {
                    const isFromCurrentUser =
                      message.sender._id === otherUser._id ? false : true;
                    return (
                      <View
                        key={message._id}
                        className={`flex-row mb-3 ${isFromCurrentUser ? "justify-end" : ""}`}
                      >
                        {!isFromCurrentUser && (
                          <Image
                            source={{
                              uri:
                                otherUser.profilePicture ||
                                "https://via.placeholder.com/150",
                            }}
                            className="size-8 rounded-full mr-2"
                          />
                        )}
                        <View
                          className={`flex-1 ${isFromCurrentUser ? "items-end" : ""}`}
                        >
                          <View
                            className={`rounded-2xl px-4 py-3 max-w-[75%] ${isFromCurrentUser ? "bg-blue-500" : "bg-gray-100"}`}
                          >
                            <Text
                              className={
                                isFromCurrentUser
                                  ? "text-white"
                                  : "text-gray-900"
                              }
                            >
                              {message.content}
                            </Text>
                          </View>
                          <Text className="text-xs text-gray-400 mt-1">
                            {getRelativeTime(message.createdAt)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </ScrollView>

            {/*Message input */}
            <View
              className={`flex-row items-center px-4 py-3 border-t border-gray-100  ${theme === "dark" ? "bg-black" : "bg-white"}`}
            >
              <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-3 mr-3">
                <TextInput
                  className="flex-1 text-base"
                  placeholder="Type a message "
                  placeholderTextColor={"#657786"}
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                  maxLength={1000}
                  editable={!isSending}
                />
              </View>
              <TouchableOpacity
                onPress={handleSend}
                className={`size-12 rounded-full items-center justify-center ${messageText.trim() && !isSending ? "bg-blue-500" : "bg-gray-300"}`}
                disabled={!messageText.trim() || isSending}
              >
                {isSending ? (
                  <ActivityIndicator size={"small"} color={"white"} />
                ) : (
                  <Feather name="send" size={20} color={"black"} />
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ChatScreen;
