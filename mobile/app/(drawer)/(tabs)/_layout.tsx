import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { useTheme } from "@/hooks/useThemeContext";
import { StatusBar } from "expo-status-bar";


const TabsLayout = () => {
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Redirect href="/(auth)" />;

  return (
    <>
      <StatusBar style="light" backgroundColor="#000000" />
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? "#ffffff" : "#1DA1F2",
        tabBarInactiveTintColor: isDark ? "#3a3d42" : "#6b7280",
        tabBarStyle: {
          backgroundColor: isDark ? "#000000" : "#fffeff",
          height: 50 + insets.bottom,
          position: "absolute",
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: insets.bottom
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
    </>
  );
};

export default TabsLayout;
