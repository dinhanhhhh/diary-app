require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const methodOverride = require("method-override");
const path = require("path");
const serverless = require("serverless-http");

// Kết nối cơ sở dữ liệu
require("./config/database");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Nếu bạn sử dụng Passport session-based, cấu hình Passport ở đây
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport); // Nếu sử dụng Passport local strategy

// Sử dụng các route
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const diaryRoutes = require("./routes/diary");
app.use("/api/diary", diaryRoutes);

// Ví dụ route cho báo cáo cảm xúc
const reportRoutes = require("./routes/report");
app.use("/api/report", reportRoutes);

// Cấu hình view engine
app.set("view engine", "ejs");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = serverless(app);

