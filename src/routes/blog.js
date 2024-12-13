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
  deleteBlog,
  addRemoveLike,
} = require("../controllers/blog");

router.route("/").get(list).post(create);

router.post("/:id/postLike", idValidation, addRemoveLike);

router
  .route("/:id")
  .all(idValidation)
  .get(read)
  .put(update)
  .patch(update)
  .delete(deleteBlog);

/* ------------------------------------------------- */

module.exports = router;
