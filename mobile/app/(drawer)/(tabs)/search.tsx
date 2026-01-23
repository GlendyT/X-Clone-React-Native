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
import { useTheme } from "@/hooks/useThemeContext";

const SearchScreen = () => {
  const {
    searchTerm,
    setSearchTerm,
    trends,
    isLoadingTrends,
    handleSearchSubmit,
    refetchTrends,
    isRefetchingTrends,
    clearSearch,
    hasSearched,
  } = useTrends();
  const router = useRouter();
  const { theme } = useTheme();

  const handleTrendClick = (topic: string) => {
    const cleanTopic = topic.replace("#", "");
    router.push({
      pathname: "/search/[hashtag]",
      params: { hashtag: cleanTopic },
    });
  };

  return (
    <SafeAreaView
      className={`flex-1  ${theme === "dark" ? "bg-black" : "bg-white"}`}
    >
      {/*HEADER */}
      <View className={`px-4 py-3  border-b border-gray-800 `}>
        <View
          className={`flex-row items-center px-4 py-3 ${theme === "dark" ? "bg-gray-900 rounded-full" : "bg-gray-100"}`}
        >
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
            <TouchableOpacity onPress={clearSearch} className="p-1">
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
          <Text
            className={`text-xl font-bold  mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}
          >
            {hasSearched && searchTerm
              ? `Results for "${searchTerm}"`
              : "Trends for you"}
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
                className={`py-3 border-b ${theme === "dark" ? "border-gray-600" : "border-gray-100"} `}
                onPress={() => handleTrendClick(item.topic)}
              >
                <Text
                  className={` text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}
                >
                  Trending in your region
                </Text>
                <Text className="font-bold text-blue-500 text-lg">
                  {item.topic}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {formatSearchCount(item.postCount)} posts
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-4">
              {hasSearched && searchTerm
                ? "No results found"
                : "No trends found"}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
