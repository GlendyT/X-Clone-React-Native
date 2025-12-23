import express from "express";
import {
  getFollowers,
  getFollowing,
} from "../controllers/follow.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { followUnfollowUser } from "../controllers/follow.controller.js";

const router = express.Router();

router.get("/:id/followers", protectRoute, getFollowers);
router.get("/:id/following", protectRoute, getFollowing);
router.post("/:id/follow", protectRoute, followUnfollowUser);

export default router;
