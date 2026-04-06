// backend/src/config/passport.js
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // User exists, check if Google ID is linked
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Check if user count is 0 (first user becomes admin)
          const userCount = await User.countDocuments();
          const role = userCount === 0 ? "admin" : "user";

          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password:
              Math.random().toString(36).slice(-16) +
              Math.random().toString(36).slice(-16),
            googleId: profile.id,
            avatar: profile.photos[0]?.value || "",
            role: role,
            isActive: true,
            emailVerified: true,
          });

          return done(null, user);
        } catch (err) {
          console.error("Google Strategy Error:", err);
          return done(err, null);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
