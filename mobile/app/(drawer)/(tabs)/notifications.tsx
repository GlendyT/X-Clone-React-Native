import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNotifications } from "@/hooks/useNotifications";
import { Feather } from "@expo/vector-icons";
import NoNotificationsFound from "@/components/NoNotificationsFound";
import NotificationCard from "@/components/NotificationCard";
import { Notification } from "@/types";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useThemeContext";

const NotificationsScreen = () => {
  const {
    notifications,
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteNotification,
  } = useNotifications();
  const router = useRouter();
  const { theme } = useTheme();

  const inset = useSafeAreaInsets();

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-8 ">
        <Text className="text-gray-500 mb-4">Failed to load notifications</Text>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg">
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1  ${theme === "dark" ? "bg-black" : "bg-white"}`}
      edges={["top"]}
    >
      {/*HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text
          className={`text-xl font-bold ${theme === "dark" ? "text-gray-200" : "text-gray-900"} `}
        >
          Notifications
        </Text>
        <TouchableOpacity
          className="p-2"
          onPress={() => router.push("/notifications/NotificationSettings")}
        >
          <Feather name="settings" size={24} color={"#657786"} />
        </TouchableOpacity>
      </View>

      {/*CONTENT */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + inset.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={"#1DA1F2"}
          />
        }
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center p-8">
            <ActivityIndicator size={"large"} />
            <Text className="text-gray-500">Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <NoNotificationsFound />
        ) : (
          notifications.map((notification: Notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onDelete={deleteNotification}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
