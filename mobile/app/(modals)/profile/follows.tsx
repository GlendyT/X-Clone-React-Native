import ListFollows from "@/components/ListFollows";
import { followApi, useApiClient } from "@/utils/api";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FollowsScreen = () => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers"
  );
  const { userId, username } = useLocalSearchParams();
  const router = useRouter();
  const api = useApiClient();

  const isFollowers = activeTab === "followers";

  const targetId = Array.isArray(userId) ? userId[0] : userId;

  const { data: users, isLoading } = useQuery({
    queryKey: ["follows", targetId, activeTab],
    queryFn: () =>
      isFollowers
        ? followApi
            .getFollowers(api, targetId as string)
            .then((res) => res.data)
        : followApi
            .getFollowing(api, targetId as string)
            .then((res) => res.data),
    enabled: !!targetId,
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size={"large"} color={"#1DA1F2"} />
      </View>
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
            @{username || "User"}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row border-b border-gray-100">
        <TouchableOpacity
          className={`flex-1 py-4 items-center ${activeTab === "followers" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("followers")}
        >
          <Text>Followers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-4 items-center ${activeTab === "following" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("following")}
        >
          <Text>Following</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ListFollows user={item} />}
        ListEmptyComponent={
          <View className="p-8 items-center">
            <Text className="text-gray-500 text-center">
              {isFollowers ? "No follows yet" : "Not following anyone yet"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default FollowsScreen;
