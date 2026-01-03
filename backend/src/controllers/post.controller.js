import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../config/claudinary.js";
import Notification from "../models/notification.model.js";
import Comment from "../models/comment.model.js";
import { shouldSendNotification } from "./notification.controller.js";
import Trend from "../models/trend.model.js";

const updateTrendsFromContent = async (content) => {
  if (!content) return;

  const hashtagRegex = /#(\w+)/g;

  const hashtags = content.match(hashtagRegex);

  if (hashtags && hashtags.length > 0) {
    const trendUpdates = hashtags.map((topic) => ({
      updateOne: {
        filter: { topic: topic.toLowerCase() },
        update: { $inc: { postCount: 1 } },
        upsert: true,
      },
    }));

    await Trend.bulkWrite(trendUpdates);
  }
};

const decrementTrendsFromContent = async (content) => {
  if (!content) return;

  const hashtagRegex = /#(\w+)/g;
  const hashtags = content.match(hashtagRegex);

  if (hashtags && hashtags.length > 0) {
    const trendsUpdates = hashtags.map((topic) => ({
      updateOne: {
        filter: { topic: topic.toLowerCase() },
        update: { $inc: { postCount: -1 } },
      },
    }));
    await Trend.bulkWrite(trendsUpdates);
  }
};

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate("repostedBy", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: [
        {
          path: "user",
          select: "username firstName lastName profilePicture",
        },
        {
          path: "replies",
          model: "Comment",
          populate: {
            path: "user",
            model: "User",
            select: "username firstName lastName profilePicture",
          },
        },
      ],
    })
    .populate({
      path: "originalPost",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  res.status(200).json({ posts });
});

export const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: [
        {
          path: "user",
          select: "username firstName lastName profilePicture",
        },
        {
          path: "replies",
          model: "Comment",
          populate: {
            path: "user",
            model: "User",
            select: "username firstName lastName profilePicture",
          },
        },
      ],
    });

  if (!post) return res.status(404).json({ error: "Post not found" });

  res.status(200).json({ post });
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const posts = await Post.find({
    user: user._id,
    isRepost: { $ne: true },
  })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate("repostedBy", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: [
        {
          path: "user",
          select: "username firstName lastName profilePicture",
        },
        {
          path: "replies",
          model: "Comment",
          populate: {
            path: "user",
            model: "User",
            select: "username firstName lastName profilePicture",
          },
        },
      ],
    })
    .populate({
      path: "originalPost",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  res.status(200).json({ posts });
});

export const createPost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { content } = req.body;
  const imageFile = req.file;

  if (!content && !imageFile) {
    return res
      .status(400)
      .json({ error: "Post must contain either text or image" });
  }

  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  let imageUrl = "";

  // upload image to Cloudinary if provided
  if (imageFile) {
    try {
      //convert buffer to base64 for cloudinary
      const base64Image = `data:${
        imageFile.mimetype
      };base64,${imageFile.buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "social_media_posts",
        resource_type: "image",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" },
          { format: "auto" },
        ],
      });
      imageUrl = uploadResponse.secure_url;
    } catch (uploadError) {
      console.log("Cloudinary upload error: ", uploadError);
      return res.status(400).json({ error: "Failed to upload image" });
    }
  }

  const post = await Post.create({
    user: user._id,
    content: content || "",
    image: imageUrl,
  });

  await updateTrendsFromContent(content);

  res.status(201).json({ post });
});

export const likePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post)
    return res.status(404).json({ error: "User or post not found" });

  const isLiked = post.likes.includes(user._id);

  if (isLiked) {
    //unlike

    await Post.findByIdAndUpdate(postId, {
      $pull: { likes: user._id },
    });
  } else {
    //like
    await Post.findByIdAndUpdate(postId, {
      $push: { likes: user._id },
    });

    // create notification if not liking ow post
    if (post.user.toString() !== user._id.toString()) {
      const shouldNotify = await shouldSendNotification(post.user, "like");

      if (shouldNotify) {
        await Notification.create({
          from: user._id,
          to: post.user,
          type: "like",
          post: postId,
        });
      }
    }
  }

  res.status(200).json({
    message: isLiked ? "Post unliked succesfully" : "Post liked successfully",
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post)
    return res.status(404).json({ error: "User or post not found" });

  if (post.user.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({ error: "You can only delete your own posts" });
  }

  // delete the count of trends before the post
  await decrementTrendsFromContent(post.content);

  // delete all comments on this post
  await Comment.deleteMany({ post: postId });

  // delete the post
  await Post.findByIdAndDelete(postId);

  res.status(200).json({ message: "Post delete successfully" });
});

//funcionalidad de repostear
export const repostPost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  //verificar que el post original existe
  const originalPost = await Post.findById(postId);
  if (!originalPost) {
    return res.status(404).json({ error: "Post not found" });
  }

  // verificar que el usuario existe
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  //verificar que no sea su propio post
  if (originalPost.user.toString() === user._id.toString()) {
    return res.status(400).json({ error: "Cannot repost your own post" });
  }

  // verificar que no haya reposteado ya
  const hasReposted = originalPost.repostedBy.includes(user._id);

  if (hasReposted) {
    //eliminar el post de repost del usuario
    await Post.findOneAndDelete({
      user: user._id,
      isRepost: true,
      originalPost: postId,
    });
    //si ya existe, eliminarlo (toggle)
    await Post.findByIdAndUpdate(postId, {
      $pull: { repostedBy: user._id },
    });
    return res.status(200).json({ message: "Repost removed successfully" });
  }

  //crear el repost
  const repost = await Post.create({
    user: user._id,
    isRepost: true,
    originalPost: postId,
  });

  // agregar el repost al post original
  await Post.findByIdAndUpdate(postId, {
    $push: { repostedBy: user._id },
  });

  // crear notificacion si no es su propio post
  if (originalPost.user.toString() !== user._id.toString()) {
    const shouldNotify = await shouldSendNotification(originalPost.user);

    if (shouldNotify) {
      await Notification.create({
        from: user._id,
        to: originalPost.user,
        type: "repost",
        post: postId,
      });
    }
  }

  res.status(201).json({ message: "Repost created succesfully", repost });
});

export const quotePost = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const { content } = req.body;

  const originalPost = await Post.findById(postId);
  if (!originalPost) {
    return res.status(404).json({ error: "Post not found" });
  }

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const quote = await Post.create({
    user: user._id,
    content: content || "",
    originalPost: postId,
  });

  await updateTrendsFromContent(content);

  await Post.findByIdAndUpdate(postId, {
    $push: { quotedBy: user._id },
  });

  if (originalPost.user.toString() !== user._id.toString()) {
    const shouldNotify = await shouldSendNotification(
      originalPost.user,
      "quote"
    );
    if (shouldNotify) {
      await Notification.create({
        from: user._id,
        to: originalPost.user,
        type: "quote",
        post: quote._id,
      });
    }
  }

  res.status(201).json({ post: quote });
});

export const getUserReposts = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const reposts = await Post.find({
    user: user._id,
    isRepost: true,
  })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate("repostedBy", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: [
        {
          path: "user",
          select: "username firstName lastName profilePicture",
        },
        {
          path: "replies",
          model: "Comment",
          populate: {
            path: "user",
            model: "User",
            select: "username firstName lastName profilePicture",
          },
        },
      ],
    })
    .populate({
      path: "originalPost",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  res.status(200).json({ posts: reposts });
});

export const getUserLikedPosts = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Verificar que el usuario autenticado es el dueño del perfil
  const authenticatedUser = await User.findOne({ clerkId: userId });
  if (
    !authenticatedUser ||
    authenticatedUser._id.toString() !== user._id.toString()
  ) {
    return res
      .status(403)
      .json({ error: "Not authorized to view these likes" });
  }

  const likedPosts = await Post.find({
    likes: user._id,
    isRepost: { $ne: true },
  })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate("repostedBy", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: [
        { path: "user", select: "username firstName lastName profilePicture" },
        {
          path: "replies",
          model: "Comment",
          populate: {
            path: "user",
            model: "User",
            select: "username firstName lastName profilePicture",
          },
        },
      ],
    })
    .populate({
      path: "originalPost",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  res.status(200).json({ posts: likedPosts });
});
