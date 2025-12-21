import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createComment,
  getComments,
  deleteComment,
  toggleLikeComment,
  createReply,
} from "../controllers/comment.controller.js";

// public routes
const router = express.Router();

router.get("/post/:postId", getComments);

//Protected routes
router.post("/post/:postId", protectRoute, createComment);
router.delete("/:commentId", protectRoute, deleteComment);
router.post("/:commentId/like", protectRoute, toggleLikeComment);
router.post("/:commentId/reply", protectRoute, createReply);

export default router;
