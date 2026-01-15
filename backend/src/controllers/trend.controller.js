import Trend from "../models/trend.model.js";
import asyncHandler from "express-async-handler";

export const recordSearch = asyncHandler(async (req, res) => {
  const { searchTerm } = req.body;

  if (!searchTerm || typeof searchTerm !== "string") {
    res.status(400);
    throw new Error("Tearm search is required");
  }

  const topic = `#${searchTerm.toLowerCase().replace(/\s+/g, "")}`;

  await Trend.findOneAndUpdate(
    { topic },
    { $inc: { searchCount: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ success: true, message: "Search trend saved" });
});

export const getTrends = asyncHandler(async (req, res) => {
  const trends = await Trend.find({}).sort({ searchCount: -1 }).limit(10);

  res.status(200).json(trends);
});
