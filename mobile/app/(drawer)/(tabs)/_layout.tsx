import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

const TabsLayout = () => {
  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Redirect href="/(auth)" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? "#dac0ee" : "#1DA1F2",
        tabBarInactiveTintColor: isDark ? "#9d82ab" : "#040a17",
        tabBarStyle: {
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#E1E8ED",
          height: 50 + insets.bottom,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Feather name="mail" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
