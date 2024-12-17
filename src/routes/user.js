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
  updateMe,
  deleteMe,
} = require("../controllers/user");

router.delete("/deleteMe", deleteMe);
router.patch("/updateMe", updateMe);

router
  .route("/")
  .get(permissions.isAdmin, list)
  .post(permissions.isAdmin, create);

router
  .route("/:id")
  .all(idValidation)
  .get(permissions.isLogin, read)
  .put(permissions.isAdmin, update)
  .patch(permissions.isAdmin, update)
  .delete(permissions.isAdmin, deleteUser);

/* ------------------------------------------------- */

module.exports = router;
