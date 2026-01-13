import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteConversation,
  getConversations,
  getMessages,
  getOrCreateConversation,
  markAsRead,
  sendMessage,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.get("/", protectRoute, getConversations);
router.get("/user/:otherUserId", protectRoute, getOrCreateConversation);
router.get("/:conversationId/messages", protectRoute, getMessages);
router.post("/:conversationId/messages", protectRoute, sendMessage);
router.patch("/:conversationId/read", protectRoute, markAsRead);
router.delete("/:conversationId", protectRoute, deleteConversation);

export default router;
