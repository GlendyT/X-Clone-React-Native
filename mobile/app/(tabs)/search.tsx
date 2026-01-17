import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTrends } from "@/hooks/useTrends";
import { formatSearchCount } from "@/utils/formatters";
import { useRouter } from "expo-router";

const SearchScreen = () => {
  const {
    searchTerm,
    setSearchTerm,
    trends,
    isLoadingTrends,
    handleSearchSubmit,
    refetchTrends,
    isRefetchingTrends,
  } = useTrends();
  const router = useRouter()
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/*HEADER */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color={"#657786"} />
          <TextInput
            placeholder="Search X"
            className="flex-1 ml-3 text-base"
            placeholderTextColor={"#657786"}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />

          {searchTerm ? (
            <TouchableOpacity onPress={() => setSearchTerm("")} className="p-1">
              <Feather name="x" size={18} color={"#657786"} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingTrends}
            onRefresh={refetchTrends}
          />
        }
      >
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Trends for you
          </Text>
          {isLoadingTrends ? (
            <ActivityIndicator
              size={"large"}
              color={"#1DA1F2"}
              className="mt-4"
            />
          ) : trends.length > 0 ? (
            trends.map((item) => (
              <TouchableOpacity
                key={item._id}
                className="py-3 border-b border-gray-100"
              >
                <Text className="text-gray-500 text-sm">
                  Trending in your region
                </Text>
                <Text
                  className="font-bold text-blue-500 text-lg"
                  onPress={() =>
                    router.push({
                      pathname: "/search/[hashtag]",
                      params: { hashtag: item.topic.replace("#", "") },
                    })
                  }
                >
                  {" "}
                  {item.topic}{" "}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {formatSearchCount(item.postCount)} posts{" "}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-4">
              No trends found
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
