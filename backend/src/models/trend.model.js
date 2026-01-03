import mongoose from "mongoose";

const trendSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      unique: true,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    searchCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Trend = mongoose.model("Trend", trendSchema);

export default Trend;
