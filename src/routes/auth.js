"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const router = require("express").Router();

const { signup, verifyEmail, login } = require("../controllers/auth");

router.post("/signup", signup);
router.get("/verifyEmail", verifyEmail);

router.post("/login", login);

module.exports = router;
