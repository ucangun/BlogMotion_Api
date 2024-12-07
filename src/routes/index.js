"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const router = require("express").Router();

// Auth:
router.use("/auth", require("./auth"));

// document:
router.use("/documents", require("./document"));

/* -------------------------------------------- */
module.exports = router;
