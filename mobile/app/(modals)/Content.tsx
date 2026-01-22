import { View, Image, Text } from "react-native";
import React from "react";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const Content = ({ ...props }: DrawerContentComponentProps) => {
  const { currentUser, isLoading } = useCurrentUser();
  return (
    <DrawerContentScrollView {...props}>
      <View className="flex-1">
        {isLoading || !currentUser ? (
          <View className="w-10 h-10 rounded-full bg-gray-200" />
        ) : (
          <Image
            source={{ uri: currentUser.profilePicture || "" }}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
        )}
      </View>
      <DrawerItemList {...props} />

      <View>
        <Text>Logout</Text>
      </View>
    </DrawerContentScrollView>
  );
};

export default Content;
