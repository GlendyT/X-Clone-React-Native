import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getConversations = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const conversations = await Conversation.find({
    participants: user._id,
  })
    .sort({ "lastMessage.sentAt": -1 })
    .populate("participants", "username firstName lastName  profilePicture")
    .populate("lastMessage.sender", "username firstName lastName");

  const formattedConversations = conversations.map((conv) => {
    const otherParticipant = conv.participants.find(
      (p) => p._id.toString() !== user._id.toString()
    );

    return {
      _id: conv._id,
      otherUser: otherParticipant,
      lastMessage: conv.lastMessage,
      unreadCount: conv.unreadCount.get(user._id.toString()) || 0,
      updatedAt: conv.updatedAt,
    };
  });

  res.status(200).json({ conversations: formattedConversations });
});

export const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { otherUserId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const otherUser = await User.findById(otherUserId);

  if (!user || !otherUser) {
    return res.status(400).json({ error: "User not found" });
  }

  if (user._id.toString() === otherUser._id.toString()) {
    return res.status(400).json({ error: "Cannot message yourself" });
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [user._id, otherUser._id] },
  }).populate("participants", "username firstName lastName profilePicture");

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [user._id, otherUser._id],
      unreadCount: {
        [user._id.toString()]: 0,
        [otherUser._id.toString()]: 0,
      },
    });

    await conversation.populate(
      "participants",
      "username firstName lastName profilePicture"
    );
  }
  res.status(200).json({ conversation });
});

export const getMessages = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { conversationId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === user._id.toString()
  )
  if (!isParticipant) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("sender", "username firstName lastName profilePicture")
    .populate("receiver", "username firstName lastName profilePicture");

  const totalMessages = await Message.countDocuments({
    conversation: conversationId,
  });

  res.status(200).json({
    messages: messages.reverse(),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalMessages,
      hasMore: skip + messages.length < totalMessages,
    },
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { conversationId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Message content is required" });
  }

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  // ✅ BIEN - convierte a string para comparar
  const isParticipant = conversation.participants.some(
    (p) => p.toString() === user._id.toString()
  );

  if (!isParticipant) {
    return res.status(403).json({ error: "Not authorized" });
  }
  const receiverId = conversation.participants.find(
    (p) => p.toString() !== user._id.toString()
  );

  const session = await mongoose.startSession();
  let message;
  try {
    await session.withTransaction(async () => {
      [message] = await Message.create(
        [
          {
            conversation: conversationId,
            sender: user._id,
            receiver: receiverId,
            content: content.trim(),
          },
        ],
        { session }
      );

      const currentUnreadCount =
        conversation.unreadCount.get(receiverId.toString()) || 0;

      conversation.lastMessage = {
        content: content.trim(),
        sender: user._id,
        sentAt: new Date(),
      };
      conversation.unreadCount.set(
        receiverId.toString(),
        currentUnreadCount + 1
      );

      await conversation.save({ session });
      await message.populate(
        "sender",
        "username firstName lastName profilePicture"
      );
      await message.populate(
        "receiver",
        "username firstName lastName profilePicture"
      );
    });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  res.status(201).json({ message });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { conversationId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }


    const isParticipant = conversation.participants.some(
    (p) => p.toString() === user._id.toString()
  )
  if (!isParticipant) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await Message.updateMany(
        {
          conversation: conversationId,
          receiver: user._id,
          read: false,
        },
        {
          $set: {
            read: true,
            readAt: new Date(),
          },
        },
        {
          session,
        }
      );

      conversation.unreadCount.set(user._id.toString(), 0);
      await conversation.save({ session });
    });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  res.status(200).json({ message: "Messages marked as read" });
});

export const deleteConversation = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { conversationId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  if (!conversation.participants.includes(user._id)) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await Message.deleteMany({ conversation: conversationId }, { session });

      await Conversation.findByIdAndDelete(conversationId, { session });
    });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  res.status(200).json({ message: "Conversation delete succesfully" });
});
