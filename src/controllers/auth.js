"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

// Auth Controller:

const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user");
const Token = require("../models/token");
const CustomError = require("../errors/customError");
const tokenHash = require("../helpers/tokenHash");
const { createSendToken, signAccessToken } = require("../helpers/jwtFunctions");
const sendMail = require("../helpers/sendMail");

module.exports = {
  signup: async (req, res) => {
    const newUser = await User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      isVerified: false,
    });

    const verificationToken = signAccessToken(newUser._id);

    const verificationUrl = `${process.env.CLIENT_URL}/auth/verifyEmail?token=${verificationToken}`;

    const message = `Welcome to our application! Please verify your email by clicking the following link: \n\n ${verificationUrl}`;

    await sendMail({
      email: newUser.email,
      subject: "Verify Your Email",
      message,
    });

    res.status(201).json({
      status: "success",
      message: "A verification email has been sent to your email address.",
    });
  },

  verifyEmail: async (req, res) => {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid or missing token.",
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: "fail",
        message: "Email already verified.",
      });
    }

    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Email successfully verified!",
    });
  },

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
