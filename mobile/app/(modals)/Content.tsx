import { View, Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, Feather } from "@expo/vector-icons";

const Content = ({ ...props }: DrawerContentComponentProps) => {
  const { currentUser, isLoading } = useCurrentUser();
  return (
    <SafeAreaView
      className="flex-1 bg-transparent py-2 "
      edges={["top", "bottom"]}
    >
      <View className=" w-full items-start justify-start gap-2 ml-6">
        <View className="flex-row  items-center  justify-between w-full  ">
          {isLoading || !currentUser ? (
            <View className="w-10 h-10 rounded-full bg-gray-200" />
          ) : (
            <Image
              source={{ uri: currentUser.profilePicture || "" }}
              className="w-10 h-10 rounded-full"
              resizeMode="cover"
            />
          )}
          <TouchableOpacity>
            <Entypo
              name="dots-three-vertical"
              size={24}
              color="black"
              className="mr-10"
            />
          </TouchableOpacity>
        </View>
        <View>
          {isLoading || !currentUser ? (
            <View className="w-24 h-4 rounded bg-gray-200" />
          ) : (
            <Text className="text-xl font-semibold">
              {currentUser.bio || "No bio available"}
            </Text>
          )}
          {isLoading || !currentUser ? (
            <View className="w-24 h-4 rounded bg-gray-200" />
          ) : (
            <Text className="text-base text-gray-500 font-semibold">
              @{currentUser.username}
            </Text>
          )}
        </View>

        <View className="flex-row gap-2 ">
          {isLoading || !currentUser ? (
            <View className="w-24 h-4 rounded bg-gray-200" />
          ) : (
            <Text className="text-lg font-semibold">
              {currentUser.followingCount || 0}{" "}
              <Text className="text-base text-gray-500 font-semibold">
                Following
              </Text>
            </Text>
          )}
          {isLoading || !currentUser ? (
            <View className="w-24 h-4 rounded bg-gray-200" />
          ) : (
            <Text className="text-lg font-semibold">
              {currentUser.followersCount || 0}{" "}
              <Text className="text-base text-gray-500 font-semibold">
                {" "}
                Followers
              </Text>
            </Text>
          )}
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View className="ml-6 ">
        <Feather name="sun" size={24} color="purple" />
      </View>
    </SafeAreaView>
  );
};

export default Content;
