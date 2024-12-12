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
  deleteUser,
} = require("../controllers/user");

router.route("/").get(list).post(create);

router
  .route("/:id")
  .all(idValidation)
  .get(read)
  .put(update)
  .patch(update)
  .delete(deleteUser);

/* ------------------------------------------------- */

module.exports = router;
