"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const router = require("express").Router();
const idValidation = require("../middlewares/idValidation");

/* ------------------------------------------------- */

const {
  list,
  create,
  read,
  update,
  deleteNote,
} = require("../controllers/note");

router.route("/").get(list).post(create);

router
  .route("/:id")
  .all(idValidation)
  .get(read)
  .put(update)
  .patch(update)
  .delete(deleteNote);

/* ------------------------------------------------- */

module.exports = router;
