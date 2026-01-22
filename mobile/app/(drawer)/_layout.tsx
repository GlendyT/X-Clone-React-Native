import React from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Feather } from "@expo/vector-icons";
import Content from "../(modals)/Content";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer
        drawerContent={(props) => <Content {...props} />}
        screenOptions={{
          drawerActiveTintColor: "#5f03bc",
          drawerInactiveTintColor: "#657786",
          drawerStyle: {
            backgroundColor: "#fff",
            width: 280,
            borderRightWidth: 1,
            borderRightColor: "#E1E8ED",
            paddingTop: 20,
            paddingHorizontal: 10,
            height: "100%",
            justifyContent: "space-between",
          },
          drawerContentStyle: {
            backgroundColor: "#fff",
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
