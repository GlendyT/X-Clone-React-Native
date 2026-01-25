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
import { useTheme } from "@/hooks/useThemeContext";

const Content = ({ ...props }: DrawerContentComponentProps) => {
  const { currentUser, isLoading } = useCurrentUser();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <SafeAreaView
      className={`flex-1 py-6 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
      edges={["top", "bottom"]}
    >
      <View className="w-full items-start justify-start gap-2 ml-6">
        <View className="flex-row items-center justify-between w-full">
          {isLoading || !currentUser ? (
            <View className="w-10 h-10 rounded-full " />
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
              color={theme === 'dark' ? 'white' : 'black'}
              className="mr-10"
            />
          </TouchableOpacity>
        </View>
        <View>
          {isLoading || !currentUser ? (
            <View className="w-24 h-4 rounded " />
          ) : (
            <Text className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {currentUser.bio || "No bio available"}
            </Text>
          )}
          {isLoading || !currentUser ? (
            <View className="w-24 h-4 rounded" />
          ) : (
            <Text className="text-base text-gray-500 font-semibold">
              @{currentUser.username}
            </Text>
          )}
        </View>

        <View className="flex-row gap-2">
          {isLoading || !currentUser ? (
            <View className="w-24 h-4 rounded " />
          ) : (
            <Text className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {currentUser.followingCount || 0}{" "}
              <Text className="text-base text-gray-500 font-semibold">
                Following
              </Text>
            </Text>
          )}
          {isLoading || !currentUser ? (
            <View className="w-24 h-4 rounded " />
          ) : (
            <Text className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {currentUser.followersCount || 0}{" "}
              <Text className="text-base text-gray-500 font-semibold">
                Followers
              </Text>
            </Text>
          )}
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity className="ml-6" onPress={toggleTheme}>
        <Feather 
          name={theme === 'dark' ? 'sun' : 'moon'} 
          size={24} 
          color={theme === 'dark' ? '#ffffff' : '#6b21a8'} 
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Content;
