import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Settings = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className=" flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={"black"} />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900">Settings</Text>
        <Feather name="settings" size={20} color={"#657786"} />
      </View>
    </SafeAreaView>
  );
};

export default Settings;
