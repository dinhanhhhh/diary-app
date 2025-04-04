// models/Diary.js
const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true, minlength: 1 },
    sentiment: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
    },
    sentimentScore: { type: Number },
    tags: [{ type: String }],
  },
  { timestamps: true } // thêm createdAt và updatedAt
);

module.exports = mongoose.model("Diary", diarySchema);
