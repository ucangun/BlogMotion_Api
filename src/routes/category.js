"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const router = require("express").Router();
const idValidation = require("../middlewares/idValidation");
// const permissions = require("../middlewares/permissions");

/* ------------------------------------------------- */

const {
  list,
  create,
  read,
  update,
  deleteCategory,
} = require("../controllers/category");

// router.use(permissions.isAdmin);

router.route("/").get(list).post(create);

router
  .route("/:id")
  .all(idValidation)
  .get(read)
  .put(update)
  .patch(update)
  .delete(deleteCategory);

/* ------------------------------------------------- */

module.exports = router;
