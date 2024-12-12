"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const router = require("express").Router();

// Auth:
router.use("/auth", require("./auth"));
// Users:
router.use("/users", require("./user"));
// Blogs:
router.use("/blogs", require("./blog"));
// Blogs:
router.use("/categories", require("./category"));

// document:
router.use("/documents", require("./document"));

/* -------------------------------------------- */
module.exports = router;
