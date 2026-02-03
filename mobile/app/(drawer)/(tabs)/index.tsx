import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Appearance,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Entypo } from "@expo/vector-icons";
import PostComposer from "@/components/PostComposer";
import PostsList from "@/components/PostsList";
import { useUserSync } from "@/hooks/useUserSync";
import { usePosts } from "@/hooks/usePosts";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useTheme } from "@/hooks/useThemeContext";

const HomeScreen = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  const [showPostComposer, setShowPostComposer] = useState(false);
  const { refetch: refetchPosts } = usePosts();

  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handlePullToRefresh = async () => {
    setIsRefetching(true);

    await refetchPosts();

    setIsRefetching(false);
  };
  useUserSync();

  const { currentUser, isLoading } = useCurrentUser();

  const { theme } = useTheme();

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-black " : "bg-white "}`}
    >
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-800 ">
        <TouchableOpacity onPress={openDrawer}>
          {isLoading || !currentUser ? (
            <View className="w-10 h-10 rounded-full " />
          ) : (
            <Image
              source={{ uri: currentUser.profilePicture || "" }}
              className="w-10 h-10 rounded-full"
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
        <Text
          className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          Home
        </Text>
        <Entypo
          name="dots-three-vertical"
          size={24}
          color={`${theme === "dark" ? "white" : "black"}`}
        />
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
        className=" absolute bg-purple-800 rounded-full p-4 items-end-center justify-center"
        style={{ bottom: 100, right: 20 }}
        onPress={() => setShowPostComposer(true)}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
