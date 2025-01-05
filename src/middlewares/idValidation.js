"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const mongoose = require("mongoose");
const CustomError = require("../errors/customError");

module.exports = (req, res, next) => {
  const idIsValid = mongoose.Types.ObjectId.isValid(req.params.id); //* built-in method
  if (!idIsValid) throw new CustomError("Id is not valid!", 400);
  next();
};
