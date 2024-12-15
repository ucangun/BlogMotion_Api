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
// Categories:
router.use("/categories", require("./category"));
// Comments:
router.use("/comments", require("./comment"));
// Notes:
router.use("/notes", require("./note"));

// document:
router.use("/documents", require("./document"));

/* -------------------------------------------- */
module.exports = router;
