"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

// Auth Controller:

const User = require("../models/user");
const Token = require("../models/token");
const CustomError = require("../errors/customError");
const tokenHash = require("../helpers/tokenHash");
const { createSendToken } = require("../helpers/jwtFunctions");

module.exports = {
  login: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get Token and JWT.'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                }
            }
        */

    const { username, password } = req.body;

    // 1) Check if username and password exist
    if (!username || !password) {
      throw new CustomError("Please provide email and password!", 400);
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ username });

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new CustomError("Incorrect email or password", 401);
    }

    // 3) Check if user isActive
    if (!user.isActive) {
      throw new CustomError("This account is not active.", 401);
    }

    // 4) If everything ok, send token to client

    // TOKEN:
    let tokenData = await Token.findOne({ userId: user._id });
    if (!tokenData)
      tokenData = await Token.create({
        userId: user._id,
        token: tokenHash(user._id + Date.now()),
      });

    // JWT:
    createSendToken(user, 200, tokenData, res);
  },
};
