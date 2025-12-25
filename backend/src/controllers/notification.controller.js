import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  const notifications = await Notification.find({ to: user._id })
    .sort({ createdAt: -1 })
    .populate("from", "username firstName lastName profilePicture")
    .populate("post", "content image")
    .populate("comment", "content");

  res.status(200).json({ notifications });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { notificationId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    to: user._id,
  });

  if (!notification)
    return res.status(404).json({ error: "Notification not found" });

  res.status(200).json({ message: "Notification deleted succesfully" });
});

export const shouldSendNotification = async (userId, notificationType) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return false;
    }

    if (!user.notificationSettings.enabled) {
      return false;
    }

    if (
      notificationType &&
      !user.notificationSettings?.types?.[notificationType]
    ) {
      return false;
    }

    return tur;
  } catch (error) {
    console.error("Error checking notification settings: ", error);
    return false;
  }
};

export const getNotificationSettings = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId }).select(
    "notificationSettings"
  );

  if (!user) {
    return res.status(404).json({ erro: "User not found" });
  }

  const settings = user.notificationSettings || {
    enabled: true,
    types: {
      follow: true,
      like: true,
      comment: true,
      repost: true,
      reply: true,
    },
  };

  res.status(200).json({ settings });
});

export const updateNotificationSettings = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { enabled, types } = req.body;

  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const updateData = {};

  if (typeof enabled === "boolean") {
    updateData["notificationSettings.types.follow"] = types.follow;
  }

  if (types && typeof types === "object") {
    if (typeof types.follow === "boolean") {
      updateData["notificationSettings.types.follow"] = types.follow;
    }
    if (typeof types.like === "boolean") {
      updateData["notificationSettings.types.like"] = types.like;
    }

    if (typeof types.comment === "boolean") {
      updateData["notificationSettings.types.comment"] = types.comment;
    }

    if (typeof types.repost === "boolean") {
      updateData["notificationSettings.types.repost"] = types.repost;
    }

    if (typeof types.reply === "boolean") {
      updateData["notificationSettings.types.reply"] = types.reply;
    }
  }

  const updateUser = await User.findByIdAndUpdate(
    user._id,
    { $set: updateData },
    { new: true }
  ).select("notificationSettings");

  res.status(200).json({ settings: updateUser.notificationSettings });
});
