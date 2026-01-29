import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import React from "react";
import { useTheme } from "@/hooks/useThemeContext";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  formData: {
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
  };
  saveProfile: () => void;
  updateFormField: (field: string, value: string) => void;
  isUpdating: boolean;
}

const EditProfileModal = ({
  isVisible,
  onClose,
  formData,
  saveProfile,
  updateFormField,
  isUpdating,
}: EditProfileModalProps) => {
  const handleSave = () => {
    saveProfile();
    onClose();
  };
  const { theme } = useTheme();

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        className={`flex-row items-center justify-between px-4 py-3 border-b  ${theme === "dark" ? "bg-black border-gray-600" : "bg-white border-gray-100"}`}
      >
        <TouchableOpacity onPress={onClose}>
          <Text className="text-blue-500 text-lg">Cancel</Text>
        </TouchableOpacity>

        <Text className="text-lg font-semibold">Edit Profile</Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isUpdating}
          className={`${isUpdating ? "opacity-50" : ""} `}
        >
          {isUpdating ? (
            <ActivityIndicator size={"small"} color={"#1DA1F2"} />
          ) : (
            <Text className="text-blue-500 text-lg font-semibold">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className={`flex-1 px-4 py-6 ${theme === "dark" ? "bg-black" : "bg-white"}`}
      >
        <View className="space-x-4">
          <View>
            <Text className="text-gray-500 text-sm mb-2">First Name</Text>
            <TextInput
              className={`border border-gray-200 rounded-lg p-3 text-base ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
              value={formData.firstName}
              onChangeText={(text) => updateFormField("firstName", text)}
              placeholder="Your first name"
            />
          </View>

          <View>
            <Text className="text-gray-500 text-sm mb-2">Last Name</Text>
            <TextInput
              className={`border border-gray-200 rounded-lg p-3 text-base ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
              value={formData.lastName}
              onChangeText={(text) => updateFormField("lastName", text)}
              placeholder="Your last name"
            />
          </View>

          <View>
            <Text className="text-gray-500 text-sm mb-2">Bio</Text>
            <TextInput
              className={`border border-gray-200 rounded-lg p-3 text-base ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
              value={formData.bio}
              onChangeText={(text) => updateFormField("bio", text)}
              placeholder="YTell us about yourself"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View>
            <Text className="text-gray-500 text-sm mb-2">Location</Text>
            <TextInput
              className={`border border-gray-200 rounded-lg p-3 text-base ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}
              value={formData.location}
              onChangeText={(text) => updateFormField("location", text)}
              placeholder="Where are you located?"
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default EditProfileModal;
