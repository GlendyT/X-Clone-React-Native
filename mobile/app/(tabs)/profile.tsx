import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import SignOutButton from "@/components/SignOutButton";
import { usePosts } from "@/hooks/usePosts";
import PostsList from "@/components/PostsList";
import { useProfile } from "@/hooks/useProfile";
import EditProfileModal from "@/components/EditProfileModal";
import ProfileLayout from "@/components/ProfileLayout";
import { useUserReposts } from "@/hooks/useReposts";
import RepostsList from "@/components/RepostsList";

const ProfileScreen = () => {
  const { currentUser, isLoading } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"posts" | "reposts">("posts");

  const { refetch: refetchPosts, isLoading: isRefetching } = usePosts(
    currentUser?.username || ""
  );

  const {
    isEditModalVisible,
    openEditModal,
    closeEditModal,
    formData,
    saveProfile,
    updateFormField,
    isUpdating,
    refetch: refetchProfile,
    pickImage,
  } = useProfile();

  const { refetch: refetchReposts } = useUserReposts(currentUser?.username);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={"large"} color={"#1DA1F2"} />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="gray-500 ">Unable to load profile</Text>
      </View>
    );
  }

  return (
    <ProfileLayout
      user={currentUser}
      isRefetching={isRefetching}
      onRefresh={() => {
        refetchPosts();
        refetchReposts()
        refetchProfile();
      }}
      headerRight={<SignOutButton />}
      actionButton={
        <TouchableOpacity
          className="border border-gray-300 px-6 py-2 rounded-full"
          onPress={openEditModal}
        >
          <Text className="font-semibold text-gray-900 ">Edit profile</Text>
        </TouchableOpacity>
      }
      canEdit={true}
      onEditBanner={() => pickImage("banner")}
      onEditProfile={() => pickImage("profile")}
      isUpdating={isUpdating}
      showTabs={true}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "posts" ? (
        <PostsList username={currentUser?.username} />
      ) : (
        <RepostsList username={currentUser?.username || ""} />
      )}
      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={closeEditModal}
        formData={formData}
        saveProfile={saveProfile}
        updateFormField={updateFormField}
        isUpdating={isUpdating}
      />
    </ProfileLayout>
  );
};

export default ProfileScreen;
