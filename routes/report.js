const express = require("express");
const router = express.Router();
const Diary = require("../models/Diary");

router.get("/", async (req, res) => {
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Chưa đăng nhập" });
  const { timeframe } = req.query; // 'week', 'month'
  const days = timeframe === "month" ? 30 : 7;
  try {
    const diaries = await Diary.find({
      userId: req.user.id,
      date: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
    });
    const sentimentCounts = diaries.reduce(
      (acc, diary) => {
        acc[diary.sentiment] = (acc[diary.sentiment] || 0) + 1;
        return acc;
      },
      { positive: 0, negative: 0, neutral: 0 }
    );
    res.json({ timeframe: `${days} ngày`, sentiments: sentimentCounts });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
