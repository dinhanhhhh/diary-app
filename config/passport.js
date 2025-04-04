const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          console.log("User tìm thấy:", user); // Debug: in ra user
          if (!user) return done(null, false, { message: "Incorrect email" });

          const isMatch = await bcrypt.compare(password, user.password);
          console.log("Password match:", isMatch); // Debug: in ra kết quả so sánh

          if (!isMatch)
            return done(null, false, { message: "Incorrect password" });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
