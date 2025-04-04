const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, minlength: 3 },
  password: { type: String, required: true, minlength: 6 },
  email: { type: String, unique: true, required: true }, // Thêm email để mở rộng tính năng
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
