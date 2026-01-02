import mongoose from "mongoose";

const trendSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      unique: true,
    },
    searchCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Trend = mongoose.model("Trend", trendSchema);

export default Trend;
