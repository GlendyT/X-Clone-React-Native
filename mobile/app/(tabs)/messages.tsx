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
import { useConversations, useUserSearch } from "@/hooks/useMessages";
import { Conversation, User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";

//TODO: IMPLEMENT REAL DATA AND FUNCTIONALITY

const MessagesScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const { searchedUsers, isSearching } = useUserSearch(searchText);

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
        params: { id: conversation.otherUser._id },
      });
    }
  };

  const startNewConversation = (user: User) => {
    if (user._id) {
      router.push({
        pathname: "/conversation/[id]",
        params: { id: user._id },
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

          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText("")} className="p-1">
              <Feather name="x" size={18} color={"#657786"} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {searchText.trim() ? (
        isSearching ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={"large"} color={"#1DA1F2"} />
          </View>
        ) : searchedUsers.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Feather name="search" size={64} color={"#E1E8ED"} />
            <Text className="text-lg font-semibold mt-4">No users found</Text>
            <Text className="text-sm text-gray-500 text-center mt-2">
              Try searching for a different name or username
            </Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
          >
            {searchedUsers.map((user: User) => (
              <TouchableOpacity
                key={user._id}
                className="flex-row items-center p-4 border-b border-gray-50 active:bg"
                onPress={() => startNewConversation(user)}
              >
                <Image
                  source={{
                    uri:
                      user.profilePicture || "https://via.placeholder.com/150",
                  }}
                  className="size-12 rounded-full mr-3"
                />
                <View className="flex-1">
                  <View className="flex-row items-center gap-1">
                    <Text className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text className="text-gray-500 text-sm ml-1">
                      @{user.username}
                    </Text>

                    {user.verified && (
                      <Feather
                        name="check-circle"
                        size={16}
                        color={"#1DA1F2"}
                        className="ml-1"
                      />
                    )}
                  </View>
                  <Text className="text-sm text-gray-500 mt-1">
                    Tap to start a conversation
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )
      ) : isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#1DA1F2"} />
        </View>
      ) : conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text>No messages</Text>
          <Text className="text-sm text-gray-500 text-center mt-2">
            Start a conversation from a user&apos;s profile
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        >
          {conversations.map((conversation: Conversation) => (
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
                      {conversation.otherUser?.firstName}{" "}
                      {conversation.otherUser?.lastName}
                    </Text>
                    <Text className="text-gray-500 text-sm ml-1">
                      @{conversation.otherUser?.username}
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
                    {getRelativeTime(conversation.lastMessage.sentAt || "")}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500" numberOfLines={1}>
                  {conversation.lastMessage.content || "No messages yet"}
                </Text>
                {conversation.unreadCount > 0 && (
                  <View className="absolute right-0 bottom-0 bg-blue-500 rounded-full size-5 items-center justify-center">
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
