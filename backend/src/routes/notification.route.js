import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getNotifications,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/:notificationId", protectRoute, deleteNotification);
router.get("/settings", protectRoute, getNotificationSettings);
router.put("/settings", protectRoute, updateNotificationSettings);

export default router;
