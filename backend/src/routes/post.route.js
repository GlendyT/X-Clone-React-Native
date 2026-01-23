import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getUserLikedPosts,
  getUserPosts,
  getUserReposts,
  likePost,
  repostPost,
  quotePost,
  searchPostsByHashtag,
  bookmarkPost,
  getUserBookmarks,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// public routes
router.get("/", getPosts);
router.get("/:postId", getPost);
router.get("/user/:username", getUserPosts);
router.get("/user/:username/reposts", getUserReposts);

//protected routes
router.post("/", protectRoute, upload.single("image"), createPost);
router.post("/:postId/like", protectRoute, likePost);
router.post("/:postId/repost", protectRoute, repostPost);
router.post("/:postId/quote", protectRoute, quotePost);
router.delete("/:postId", protectRoute, deletePost);
router.get("/user/:username/likes", protectRoute, getUserLikedPosts);
router.get("/hashtag/:hashtag", searchPostsByHashtag);
router.post("/:postId/bookmark", protectRoute, bookmarkPost);
router.get("/user/:username/bookmarks", protectRoute, getUserBookmarks);

export default router;
