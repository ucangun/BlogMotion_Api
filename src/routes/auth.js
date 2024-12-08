"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const router = require("express").Router();

const { signup, verifyEmail, login, logout } = require("../controllers/auth");

router.post("/signup", signup);
router.get("/verifyEmail", verifyEmail);

router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
