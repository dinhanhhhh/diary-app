// routes/diaries.js
const express = require("express");
const router = express.Router();
const Diary = require("../models/Diary");
const { analyzeEmotion } = require("../services/sentiment");

// Middleware để đảm bảo người dùng đã đăng nhập
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/api/auth/login");
}

// Tạo nhật ký mới
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const sentiment = analyzeEmotion(content);
    const diary = new Diary({
      user: req.user._id,
      title,
      content,
      sentiment,
    });
    await diary.save();
    // Thay vì trả về JSON, chuyển hướng về trang danh sách nhật ký
    res.redirect("/api/diary");
  } catch (err) {
    res.status(500).send("Error creating diary entry");
  }
});

// Lấy danh sách nhật ký của người dùng
router.get("/", isAuthenticated, async (req, res) => {
  try {
    // Sắp xếp theo createdAt (nhờ timestamps)
    const diaries = await Diary.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("diaryList", { diaries });
  } catch (err) {
    res.status(500).send("Error fetching diaries");
  }
});

// Cập nhật nhật ký
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const sentiment = analyzeEmotion(content);
    const diary = await Diary.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content, sentiment },
      { new: true }
    );
    if (!diary) return res.status(404).send("Diary entry not found");
    res.redirect("/api/diary");
  } catch (err) {
    res.status(500).send("Error updating diary entry");
  }
});

// Xóa nhật ký
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const diary = await Diary.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!diary) return res.status(404).send("Diary entry not found");
    res.redirect("/api/diary");
  } catch (err) {
    res.status(500).send("Error deleting diary entry");
  }
});

// Hiển thị form tạo nhật ký
router.get("/new", isAuthenticated, (req, res) => {
  res.render("diaryForm", { diary: null }); // Sử dụng cùng view cho create/update
});

// Hiển thị form chỉnh sửa nhật ký
router.get("/:id/edit", isAuthenticated, async (req, res) => {
  try {
    const diary = await Diary.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!diary) return res.status(404).send("Diary not found");
    res.render("diaryForm", { diary });
  } catch (err) {
    res.status(500).send("Error loading diary for edit");
  }
});

module.exports = router;
