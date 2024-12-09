"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const router = require("express").Router();

const {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

router.post("/signup", signup);
router.get("/verify-email", verifyEmail);

router.post("/login", login);
router.post("/logout", logout);

router.post("/forgotPassword", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

module.exports = router;
