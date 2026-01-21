import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useThemeContext";

const Settings = () => {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-black" : "bg-white"} `}
    >
      <View
        className={`flex-row justify-between items-center px-4 py-3 border-b  ${theme === "dark" ? "border-gray-600" : "border-gray-100"} `}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={"gray"} />
        </TouchableOpacity>

        <Text
          className={`text-xl font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
        >
          Settings
        </Text>
        <Feather name="settings" size={20} color={"#657786"} />
      </View>
    </SafeAreaView>
  );
};

export default Settings;
