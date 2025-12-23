import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import { User } from "@/types";

interface ProfileLayoutProps {
  user: User | undefined;
  isRefetching: boolean;
  onRefresh: () => void;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  actionButton?: React.ReactNode;
  children: React.ReactNode;
  canEdit?: boolean;
  onEditBanner?: () => void;
  onEditProfile?: () => void;
  isUpdating?: boolean;
  showTabs?: boolean;
  activeTab: "posts" | "reposts" | "likes";
  onTabChange?: (tab: "posts" | "reposts" | "likes") => void;
  onFollowingPress?: () => void;
  onFollowersPress?: () => void;
}

const ProfileLayout = ({
  user,
  isRefetching,
  onRefresh,
  headerLeft,
  headerRight,
  actionButton,
  canEdit,
  onEditBanner,
  onEditProfile,
  isUpdating,
  children,
  showTabs,
  activeTab,
  onTabChange,
  onFollowersPress,
  onFollowingPress,
}: ProfileLayoutProps) => {
  const insets = useSafeAreaInsets();

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/*HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center">
          {headerLeft ? <View className="mr-4">{headerLeft}</View> : null}
          <View>
            <Text className="text-xl font-bold text-gray-900">
              {user.firstName || ""} {user.lastName || ""}
            </Text>
            <Text className="text-gray-500 text-sm">
              @{user.username || ""}
            </Text>
          </View>
        </View>
        {headerRight}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 100 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={"#1DA1F2"}
          />
        }
      >
        {/*BANNER */}
        <View className="relative">
          <Image
            source={{
              uri:
                user.bannerImage ||
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
            }}
            className="w-full h-48"
            resizeMode="cover"
          />
          {canEdit && (
            <TouchableOpacity
              className="absolute top-4 right-4  bg-black/50 p-2 rounded-full"
              onPress={onEditBanner}
              disabled={isUpdating}
            >
              <Feather name="camera" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <View className="px-4 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <View className="relative">
              <Image
                source={{
                  uri: user.profilePicture || "default-avatar-url",
                }}
                className="w-32 h-32 rounded-full border-4 border-white"
              />
              {canEdit && (
                <TouchableOpacity
                  className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full"
                  onPress={onEditProfile}
                  disabled={isUpdating}
                >
                  <Feather name="camera" size={16} color={"white"} />
                </TouchableOpacity>
              )}
            </View>
            {actionButton && actionButton}
          </View>

          {/*User info */}
          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {user.firstName} {user.lastName}
              </Text>
              <Feather name="check-circle" size={20} color={"#1DA1F2"} />
            </View>
            <Text className="text-gray-500 mb-2">@{user.username}</Text>
            <Text className="text-gray-900 mb-3">
              {user.bio || "No bio available"}
            </Text>

            <View className="flex-row items-center mb-2">
              <Feather name="map-pin" size={16} color={"#657786"} />
              <Text> {user.location || "Location not specified yet"}</Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={16} color={"#657786"} />
              <Text className="text-gray-500 ml-2">
                Joined{" "}
                {user.createdAt
                  ? format(new Date(user.createdAt), "MMMM yyyy")
                  : ""}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity className="mr-6" onPress={onFollowingPress}>
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {user.followingCount || 0}
                    
                  </Text>
                  <Text className="text-gray-500 "> Following</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="mr-6" onPress={onFollowersPress}>
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {user.followersCount || 0}
                  </Text>
                  <Text className="text-gray-500 "> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/*Tabs - solo si showTabs es true */}
        {showTabs && (
          <View className="flex-row border-b border-gray-200">
            <TouchableOpacity
              className={`flex-1 py-4 items-center ${activeTab === "posts" ? "border-b-2 border-blue-500" : ""}`}
              onPress={() => onTabChange?.("posts")}
            >
              <Text
                className={`font-semibold ${activeTab === "posts" ? "text-blue-500" : "text-gray-500"}`}
              >
                Posts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-4 items-center ${activeTab === "reposts" ? "border-b-2 border-blue-500" : ""}`}
              onPress={() => onTabChange?.("reposts")}
            >
              <Text
                className={`font-semibold ${activeTab === "reposts" ? "text-blue-500" : "text-gray-500"}`}
              >
                Reposts
              </Text>
            </TouchableOpacity>

            {/*Solo mostrar likes si es el propio usuario */}
            {canEdit && (
              <TouchableOpacity
                className={`flex-1 py-4 items-center ${activeTab === "likes" ? "border-b-2 border-blue-500" : ""}`}
                onPress={() => onTabChange?.("likes")}
              >
                <Text
                  className={`font-semibold ${activeTab === "likes" ? "text-blue-500" : "text-gray-500"}`}
                >
                  Likes
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/*POSTS */}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileLayout;
