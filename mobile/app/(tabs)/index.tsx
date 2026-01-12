import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import PostComposer from "@/components/PostComposer";
import PostsList from "@/components/PostsList";
import { useUserSync } from "@/hooks/useUserSync";
import { usePosts } from "@/hooks/usePosts";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProfileSidebar from "@/components/ProfileSidebar";

const HomeScreen = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  const [showPostComposer, setShowPostComposer] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const { refetch: refetchPosts } = usePosts();

  const handlePullToRefresh = async () => {
    setIsRefetching(true);

    await refetchPosts();

    setIsRefetching(false);
  };
  useUserSync();

  const { currentUser } = useCurrentUser();
  console.log("imagen aqui", currentUser.profilePicture);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        {showProfileSidebar && (
          <ProfileSidebar onClose={() => setShowProfileSidebar(false)} />
        )}
        <TouchableOpacity onPress={() => setShowProfileSidebar(true)}>
          <Image
            source={{ uri: currentUser.profilePicture || "" }}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Home</Text>
        <Entypo name="dots-three-vertical" size={24} color="black" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handlePullToRefresh}
            tintColor={"#1DA1F2"}
          />
        }
      >
        <PostsList />
      </ScrollView>

      {showPostComposer && (
        <PostComposer onClose={() => setShowPostComposer(false)} />
      )}
      <TouchableOpacity
        className="absolute bg-purple-800 rounded-full p-4 items-end-center justify-center"
        style={{ bottom: 10, right: 20 }}
        onPress={() => setShowPostComposer(true)}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
