import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useConversations } from "@/hooks/useMessages";
import { Conversation } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";


//TODO: IMPLEMENT REAL DATA AND FUNCTIONALITY

const MessagesScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const {
    conversations,
    isLoading,
    refetch,
    deleteConversation: deleteConv,
  } = useConversations();

  const deleteConversation = (conversationId: string) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteConv(conversationId);
          },
        },
      ]
    );
  };

  const openConversation = (conversation: Conversation) => {
    // Navegar a la pantalla de chat con el userId del otro usuario
    if (conversation.otherUser?._id) {
      router.push({
        pathname: "/conversation/[id]",
        params: { id: conversation.otherUser._id }
      });
    }
  };

  const filteredConversations = conversations.filter(
    (conv: Conversation) =>
      conv.otherUser?.username
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      conv.otherUser?.firstName
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      conv.otherUser?.lastName.toLowerCase().includes(searchText.toLowerCase())
  );

  const getRelativeTime = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
        .replace("about", " ")
        .replace("ago", "");
    } catch {
      return "";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/*HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Messages</Text>
        <TouchableOpacity>
          <Feather name="edit" size={24} color={"#1DA1F2"} />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color={"#657786"} />
          <TextInput
            placeholder="Search for people and groups"
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#657786"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#1DA1F2"} />
        </View>
      ) : filteredConversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Feather name="message-circle" size={64} color={"#E1E8ED"} />
          <Text>No messages yet</Text>
          <Text className="text-sm text-gray-500 text-center mt-2">
            {searchText
              ? "No conersations found"
              : "Start a conversation from a user's profile"}
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        >
          {filteredConversations.map((conversation: Conversation) => (
            <TouchableOpacity
              key={conversation._id}
              className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50"
              onPress={() => openConversation(conversation)}
              onLongPress={() => deleteConversation(conversation._id)}
            >
              <Image
                source={{
                  uri:
                    conversation.otherUser?.profilePicture ||
                    "https://via.placeholder.com/150",
                }}
                className="size-12 rounded-full mr-3"
              />

              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center gap-1">
                    <Text className="font-semibold text-gray-900">
                      {" "}
                      {conversation.otherUser?.firstName}
                      {conversation.otherUser?.lastName}
                    </Text>
                    <Text className="text-gray-500 text-sm ml-1">
                      @{conversation.otherUser?.username}{" "}
                    </Text>
                    {conversation.otherUser?.verified && (
                      <Feather
                        name="check-circle"
                        size={16}
                        color={"#1DA1F2"}
                        className="ml-1"
                      />
                    )}
                  </View>
                  <Text className="text-gray-500 text-sm">
                    {getRelativeTime(conversation.lastMessage?.sentAt || "")}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500" numberOfLines={1}>
                  {conversation.lastMessage?.content || "No messages yet"}
                </Text>
                {conversation.unreadCount > 0 && (
                  <View className="bg-blue-500 rounded-full size-5 items-center justify-center ml-2">
                    <Text className="text-white text-xs font-semibold">
                      {conversation.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {/* CONVERSATION LIST  */}

      {/*  QUICK ACTIONS */}
      <View className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <Text className="text-xs text-gray-500 text-center">
          Tap to open • Long press to delete
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default MessagesScreen;
