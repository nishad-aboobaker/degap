const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const { env } = require("./env");
const User = require("../models/User");
const { logger } = require("../utils/logger");

/**
 * Serialize user ID into the session (not strictly required for JWT-based auth,
 * but Passport requires these stubs).
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || null);
  } catch (err) {
    done(err);
  }
});

function ensureOAuthEnv() {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    logger.warn("Google OAuth env vars not configured; Google strategy disabled.");
  }
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    logger.warn("GitHub OAuth env vars not configured; GitHub strategy disabled.");
  }
}

ensureOAuthEnv();

// Google OAuth strategy
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const providerId = profile.id;

          let user = await User.findOne({
            authProvider: "google",
            authProviderId: providerId,
          });

          if (!user) {
            // Try to link to existing email-based account
            const email = profile.emails?.[0]?.value;
            if (email) {
              user = await User.findOne({ email });
            }

            if (!user) {
              user = await User.create({
                name: profile.displayName || "Google User",
                email: profile.emails?.[0]?.value,
                authProvider: "google",
                authProviderId: providerId,
                emailVerified: true,
                profilePicture: profile.photos?.[0]?.value || null,
              });
            } else {
              user.authProvider = "google";
              user.authProviderId = providerId;
              if (!user.profilePicture && profile.photos?.[0]?.value) {
                user.profilePicture = profile.photos[0].value;
              }
              await user.save();
            }
          }

          return done(null, user);
        } catch (err) {
          logger.error("Google OAuth error:", err);
          return done(err, null);
        }
      }
    )
  );
}

// GitHub OAuth strategy
if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const providerId = profile.id;

          let user = await User.findOne({
            authProvider: "github",
            authProviderId: providerId,
          });

          if (!user) {
            // GitHub may have primary email in profile.emails
            const email = profile.emails?.[0]?.value;

            if (email) {
              user = await User.findOne({ email });
            }

            if (!user) {
              user = await User.create({
                name: profile.displayName || profile.username || "GitHub User",
                email,
                authProvider: "github",
                authProviderId: providerId,
                emailVerified: !!email,
                profilePicture: profile.photos?.[0]?.value || null,
              });
            } else {
              user.authProvider = "github";
              user.authProviderId = providerId;
              if (!user.profilePicture && profile.photos?.[0]?.value) {
                user.profilePicture = profile.photos[0].value;
              }
              await user.save();
            }
          }

          return done(null, user);
        } catch (err) {
          logger.error("GitHub OAuth error:", err);
          return done(err, null);
        }
      }
    )
  );
}

module.exports = passport;

