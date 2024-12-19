const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/oauth2/callback/google",
    },
    async (accessToken, refreshToken, profile, done) => {
      // 'done' is passed here as the callback
      try {
        console.log("Google Profile: ", profile);
        const email = profile.emails[0].value;

        // First, check if the user already exists in the database using Google ID or email
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: email }],
        });

        // If the user exists, we update their information
        if (user) {
          user.googleId = profile.id;
          user.firstName = profile.name.givenName || user.firstName;
          user.lastName = profile.name.familyName || user.lastName;
          user.image = profile.photos ? profile.photos[0].value : user.image;

          await user.save();
          return done(null, user); // Use 'done' here to return the user
        }

        let username =
          profile.name.givenName.toLowerCase() +
          profile.name.familyName.toLowerCase();

        // If the user does not exist, create a new user
        user = new User({
          googleId: profile.id,
          username,
          email,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos
            ? profile.photos[0].value
            : "default-avatar.jpg",
        });

        await user.save();
        return done(null, user); // Use 'done' to return the newly created user
      } catch (err) {
        return done(err); // Use 'done' to return errors
      }
    }
  )
);
