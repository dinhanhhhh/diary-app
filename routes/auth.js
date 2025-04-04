const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Hiển thị trang đăng ký
router.get("/register", (req, res) => {
  res.render("register");
});

// Đăng ký người dùng
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    // Ở đây đặt isVerified thành true (hoặc bạn có thể thay đổi theo logic xác thực của bạn)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });
    await newUser.save();

    // Sau khi đăng ký thành công, chuyển hướng đến trang đăng nhập
    res.redirect("/api/auth/login");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send("Error registering user");
  }
});


// Hiển thị trang đăng nhập
router.get("/login", (req, res) => {
  res.render("login");
});

// Đăng nhập người dùng
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/api/auth/profile",
    failureRedirect: "/api/auth/login",
  })
);

// Route logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/api/auth/login");
  });
});

// Middleware bảo vệ route cho các trang yêu cầu đăng nhập
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/api/auth/login");
}

// Trang profile của người dùng
router.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.user });
});

module.exports = router;
