"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const router = require("express").Router();
const idValidation = require("../middlewares/idValidation");
const permissions = require("../middlewares/permissions");

/* ------------------------------------------------- */

const {
  list,
  create,
  read,
  update,
  deleteUser,
} = require("../controllers/user");

router
  .route("/")
  .get(permissions.isAdmin, list)
  .post(permissions.isAdmin, create);

router
  .route("/:id")
  .all(idValidation)
  .get(permissions.isLogin, read)
  .put(permissions.isLogin, update)
  .patch(permissions.isLogin, update)
  .delete(permissions.isLogin, deleteUser);

/* ------------------------------------------------- */

module.exports = router;
