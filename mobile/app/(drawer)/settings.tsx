import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useThemeContext";

const optionSettings = [
  {
    id: "Your account",
  },
  {
    id: "Monetization",
  },
  {
    id: "Premium",
  },
  {
    id: "Creator Subscriptions",
  },
  {
    id: "Security and account access",
  },
  {
    id: "Privacy and safety",
  },
  {
    id: "Notifications",
  },
  {
    id: "Accessibility, display and language",
  },
  {
    id: "Additional resources",
  },
  {
    id: "Help center",
  },
];

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
        <Feather  size={20} color={"#657786"} />
      </View>
      <View
        className={`flex flex-row items-center px-4 py-1 ${theme === "dark" ? "btg-gray-900 rounded-full" : "bg-gray-100"} `}
      >
        <Feather name="search" size={20} color={"#657786"} />
        <TextInput
          placeholder="Search X"
          className="flex-1 ml-3 text-base"
          placeholderTextColor={"#657786"}
          value=""
          onChangeText={() => {}}
          onSubmitEditing={() => {}}
          returnKeyType="search"
        />
      </View>

      {optionSettings.map((option) => (
        <TouchableOpacity className="flex-row px-4 justify-between py-3 " key={option.id}>
          <Text>{option.id} </Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={"black"}
          />
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

export default Settings;
