"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

module.exports = {
  isLogin: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login.");
    }
  },

  isStaff: (req, res, next) => {
    if (
      req.user &&
      req.user.isActive &&
      (req.user.isAdmin || req.user.isStaff)
    ) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login and to be Admin.");
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login and to be Admin.");
    }
  },
};
