import { useNotifications } from "@/hooks/useNotifications";
import {
  View,
  Text,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const NotificationSettings = () => {
  const { notificationSettings, isLoadingSettings, updateSettings } =
    useNotifications();
  const router = useRouter();
  const [localSettings, setLocalSettings] = useState(notificationSettings);

  useEffect(() => {
    if (notificationSettings) {
      setLocalSettings(notificationSettings);
    }
  }, [notificationSettings]);

  const toggleMaster = () => {
    const newValue = !localSettings.enabled;
    setLocalSettings({ ...localSettings, enabled: newValue });
    updateSettings({ enabled: newValue });
  };

  const toggleType = (type: string) => {
    const newTypes = {
      ...localSettings.types,
      [type]: !localSettings.types[type],
    };

    setLocalSettings({ ...localSettings, types: newTypes });
    updateSettings({ types: newTypes });
  };

  if (isLoadingSettings) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
        <Text className="text-gray-500 mt-2">Loading settings...</Text>
      </SafeAreaView>
    );
  }

  if (!notificationSettings) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-gray-500">No settings available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 flex-row "
        >
          <Feather name="arrow-left" size={24} color="black" />
          <Text className="text-lg font-bold text-gray-900 ml-4">
            Notification Settings
          </Text>
        </TouchableOpacity>
      </View>

      <View className="px-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-base text-gray-800">Enable Notification</Text>
          <Switch value={localSettings.enabled} onValueChange={toggleMaster} />
        </View>

        <View className="border-t border-gray-100 pt-4 ">
          {Object.keys(localSettings.types).map((type) => (
            <View
              key={type}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
            >
              <Text className="text-base text-gray-800 capitalize">{type}</Text>
              <Switch
                value={localSettings.types[type]}
                onValueChange={() => toggleType(type)}
                disabled={!localSettings.enabled}
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotificationSettings;
