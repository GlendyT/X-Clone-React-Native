import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import mongoose from "mongoose";

export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId, parentComment: null })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "replies",
      model: "Comment",
      populate: {
        path: "user",
        model: "User",
        select: "username firstName lastName profilePicture",
      },
      options: { sort: { createdAt: 1 } },
    });

  res.status(200).json({ comments });
});

export const createComment = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment content is required" });
  }

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post)
    return res.status(404).json({ error: "User or post not found" });

  //   const comment = await Comment.create({
  //     user: user_id,
  //     post: postId,
  //     content,
  //   });

  //   //link the comment to the post
  //   await Post.findByIdAndUpdate(postId, {
  //     $push: { comments: comment._id },
  //   });

  const session = await mongoose.startSession();
  let comment;

  try {
    await session.withTransaction(async () => {
      // Model.create() with session requires an array as first argument
      const [newComment] = await Comment.create(
        [
          {
            user: user._id,
            post: postId,
            content,
          },
        ],
        { session }
      );
      comment = newComment;

      //link the comment to the post
      await Post.findByIdAndUpdate(
        postId,
        {
          $push: { comments: comment._id },
        },
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  // create notification if not commenting on own post
  if (post.user.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "comment",
      post: postId,
      comment: comment._id,
    });
  }

  res.status(201).json({ comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { commentId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const comment = await Comment.findById(commentId);

  if (!user || !comment) {
    return res.status(404).json({ error: "User or comment not found" });
  }

  const post = await Post.findById(comment.post);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  if (
    comment.user.toString() !== user._id.toString() &&
    post.user.toString() !== user._id.toString()
  ) {
    return res.status(403).json({
      error: "You can only delete your own comments or comments on your posts",
    });
  }

  // remove comment from post
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: commentId },
  });

  await Comment.findByIdAndDelete(commentId);

  res.status(200).json({ message: "Comment deleted successfully" });
});

export const toggleLikeComment = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { commentId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const comment = await Comment.findById(commentId);

  if (!user || !comment) {
    return res.status(404).json({ error: "User or comment not found" });
  }

  const isLiked = comment.likes.includes(user._id);

  if (isLiked) {
    await Comment.findByIdAndUpdate(commentId, {
      $pull: { likes: user._id },
    });
  } else {
    await Comment.findByIdAndUpdate(commentId, {
      $addToSet: { likes: user._id },
    });
  }

  res.status(200).json({ message: "Like toggled successfully" });
});

export const createReply = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Reply content is required" });
  }

  const user = await User.findOne({ clerkId: userId });
  const parentComment = await Comment.findById(commentId).populate("post");

  if (!user || !parentComment) {
    return res.status(404).json({ error: "User or comment not found" });
  }

  const session = await mongoose.startSession();
  let reply;

  try {
    await session.withTransaction(async () => {
      const [newReply] = await Comment.create(
        [
          {
            user: user._id,
            post: parentComment.post._id,
            content,
            parentComment: commentId,
          },
        ],
        {
          session,
        }
      );
      reply = newReply;

      await Comment.findByIdAndUpdate(
        commentId,
        {
          $push: { replies: reply._id },
        },
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  // Verificar que se agregó correctamente
  const updatedParent = await Comment.findById(commentId);

  // create the notification if is not a reply to own comment
  if (parentComment.user.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: parentComment.user,
      type: "reply",
      post: parentComment.post._id,
      comment: reply._id,
    });
  }

  res.status(201).json({ reply });
});
