import express from "express";
import {
  getCurrentUser,
  getUserProfile,
  syncUser,
  updateProfile,
  getUserById,
  searchUsers
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//Public route
router.get("/profile/:username", getUserProfile);

//Protected routes
router.post("/sync", protectRoute, syncUser);
router.get("/me", protectRoute, getCurrentUser);
router.put("/profile", protectRoute, updateProfile);
router.get("/search", protectRoute, searchUsers)
router.get("/:id", protectRoute, getUserById)

// update profile => auth

export default router;
