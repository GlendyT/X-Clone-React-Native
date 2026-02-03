import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Feather } from "@expo/vector-icons";
import Content from "../(modals)/Content";
import { useColorScheme } from "nativewind";

export default function DrawerLayout() {
  const { colorScheme } = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  return (
    <GestureHandlerRootView  >
      <Drawer
        drawerContent={(props) => <Content {...props} />}
        screenOptions={{
          drawerActiveTintColor: isDark ? "#322a2a" : "#a982c4",
          drawerInactiveTintColor: isDark ? "#9ca3af" : "#293a5e",
          drawerActiveBackgroundColor: isDark ? "#e5d2fb" : "#f3f4f6",
          drawerItemStyle: { marginVertical: 0 },
          drawerStyle: {
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            width: 280,
            height: "100%",
            justifyContent: "space-between",
            alignItems: "stretch",
          },
          drawerContentStyle: {
            alignItems: "stretch",
            justifyContent: "space-between",
            height: "100%",
            alignContent: "stretch",
          },
          headerShown: false,
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Profile",
            title: "Profile",
            drawerIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="bookmarks"
          options={{
            drawerLabel: "Bookmarks",
            title: "Bookmarks",
            drawerIcon: ({ color, size }) => (
              <Feather name="bookmark" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
            drawerIcon: ({ color, size }) => (
              <Feather name="settings" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
