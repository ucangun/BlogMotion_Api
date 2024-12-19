"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const router = require("express").Router();
const passport = require("passport");

/* ------------------------------------------------- */

const {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  authSuccess,
} = require("../controllers/auth");

router.post("/signup", signup);
router.get("/verify-email", verifyEmail);

router.post("/login", login);
router.get("/logout", logout);

router.post("/forgotPassword", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

// Google authentication routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    session: true,
    failureRedirect: `${process.env.CLIENT_URL}/auth/failure`,
  }),
  authSuccess
);

/* ------------------------------------------------- */

module.exports = router;
