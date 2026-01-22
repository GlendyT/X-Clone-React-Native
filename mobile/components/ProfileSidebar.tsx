
import React from "react";
import { Drawer } from 'expo-router/drawer';
const ProfileSidebar = ({onClose}: {onClose: () => void}) => {
  return (
    <Drawer>
      <Drawer.Screen
      />
      <Drawer.Screen
        name="profile" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'User',
          title: 'overview',
        }}
      />
    </Drawer>
  );
};

export default ProfileSidebar;
