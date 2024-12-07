"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const router = require("express").Router();

// URL: /

// document:
router.use("/documents", require("./document"));

/* -------------------------------------------- */
module.exports = router;
