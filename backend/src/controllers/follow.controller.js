import asyncHandler from "express-async-handler";
import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import { getAuth } from "@clerk/express";
import Notification from "../models/notification.model.js";
import { shouldSendNotification } from "./notification.controller.js";

export const getFollowers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = getAuth(req);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const currentUser = await User.findOne({ clerkId: userId });

  const followersData = await Follow.find({ following: id })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "follower",
      select: "username firstName lastName profilePicture bio",
    });

  const followers = followersData.map((f) => f.follower);

  const followersWithStatus = await Promise.all(
    followers.map(async (follower) => {
      const isFollowing = await Follow.exists({
        follower: currentUser._id,
        following: follower._id,
      });
      return {
        ...follower.toObject(),
        isFollowing: !!isFollowing,
      };
    })
  );

  res.status(200).json(followersWithStatus);
});

export const getFollowing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = getAuth(req);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const currentUser = await User.findOne({ clerkId: userId });

  const followingData = await Follow.find({ follower: id })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "following",
      select: "username firstName lastName profilePicture bio",
    });

  const following = followingData.map((f) => f.following);

  const followingWithStatus = await Promise.all(
    following.map(async (user) => {
      const isFollowing = await Follow.exists({
        follower: currentUser._id,
        following: user._id,
      });
      return {
        ...user.toObject(),
        isFollowing: !!isFollowing,
      };
    })
  );

  res.status(200).json(followingWithStatus);
});

export const followUnfollowUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { id } = req.params;

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(id);

  if (!currentUser || !targetUser) {
    return res.status(404).json({ error: "User not found" });
  }

  if (id === currentUser._id.toString()) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  const existingFollow = await Follow.findOne({
    follower: currentUser._id,
    following: id,
  });
  console.log(existingFollow);

  if (existingFollow) {
    await Follow.findByIdAndDelete(existingFollow._id);
    await User.findByIdAndUpdate(currentUser._id, {
      $inc: { followingCount: -1 },
    });
    await User.findByIdAndUpdate(id, { $inc: { followersCount: -1 } });
    res.status(200).json({ message: "User unfollowed successfully" });
  } else {
    await Follow.create({
      follower: currentUser._id,
      following: id,
    });

    await User.findByIdAndUpdate(currentUser._id, {
      $inc: { followingCount: 1 },
    });
    await User.findByIdAndUpdate(id, { $inc: { followersCount: 1 } });

    const shouldNotify = await shouldSendNotification(id, "follow");

    if (shouldNotify) {
      await Notification.create({
        from: currentUser._id,
        to: id,
        type: "follow",
      });
    }

    res.status(200).json({ message: "User followed successfully" });
  }
});
