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
}

const ProfileLayout = ({
  user,
  isRefetching,
  onRefresh,
  headerLeft,
  headerRight,
  actionButton,
  children,
}: ProfileLayoutProps) => {
  const insets = useSafeAreaInsets();

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/*HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center">
          {headerLeft && <View className="mr-4">{headerLeft} </View>}
          <View>
            <Text className="text-xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </Text>
            <Text className="text-gray-500 text-sm">@{user.username}</Text>
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
        <Image
          source={{
            uri:
              user.bannerImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="px-4 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <Image
              source={{
                uri: user.profilePicture || "default-avatar-url",
              }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            {actionButton}
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
                Joined
                {user.createdAt
                  ? format(new Date(user.createdAt), "MMMM yyyy")
                  : ""}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity className="mr-6">
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {user.following?.length || 0}
                  </Text>
                  <Text className="text-gray-500 "> Following</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="mr-6">
                <Text className="text-gray-900">
                  <Text className="font-bold">
                    {user.followers?.length || 0}
                  </Text>
                  <Text className="text-gray-500 "> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/*POSTS */}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileLayout;
