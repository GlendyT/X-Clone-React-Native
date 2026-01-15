import express from "express"
import { getTrends, recordSearch } from "../controllers/trend.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.get("/", protectRoute, getTrends)
router.post("/", protectRoute,recordSearch)

export default router