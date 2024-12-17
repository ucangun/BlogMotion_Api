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
const blacklistToken = require("../helpers/blacklistFunctions");
const resetTokenHash = require("../helpers/resetTokenHash");

module.exports = {
  signup: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Signup"
            #swagger.description = 'Create a new user account and send a verification email.'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "testUser",
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "test@example.com",
                    "password": "password123"
                }
            }
          
        */

    const newUser = await User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      isVerified: false,
    });

    const verificationToken = signAccessToken(newUser._id);

    const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${verificationToken}`;

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
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Verify Email"
            #swagger.description = 'Verify a user’s email address using a token sent via email.'
            #swagger.parameters["token"] = {
                in: "query",
                required: true,
                description: "Verification token from email.",
                type: "string"
            }
        */
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
            #swagger.description = 'Login with username (or email) and password to get Token and JWT.'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "testUser",
                    "password": "password123"
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

    // 3) Check if user isActive
    if (!user.isActive) {
      throw new CustomError(
        "This account is not active. Please contact support for assistance.",
        401
      );
    }

    // 4) Compare  Password
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new CustomError("Incorrect email or password", 401);
    }

    // 5) If everything ok, send token to client
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

  logout: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Logout"
            #swagger.description = 'Logout user by deleting or blacklisting the token.'
            #swagger.parameters["authorization"] = {
                in: "header",
                required: true,
                description: "Authorization token in 'Bearer <token>' or 'Token <token>' format.",
                type: "string"
            }
        */
    const auth = req.headers?.authorization || null;

    if (!auth) {
      return res.status(400).json({
        status: "fail",
        message:
          "Authorization header is missing. Please provide a valid token.",
      });
    }

    const [tokenType, tokenValue] = auth.split(" ");

    if (!tokenValue) {
      return res.status(400).json({
        status: "fail",
        message:
          "Token value is missing. Ensure the format is 'Token <value>' or 'Bearer <value>'.",
      });
    }

    switch (tokenType) {
      case "Token":
        const result = await Token.deleteOne({ token: tokenValue });

        return res.status(result.deletedCount > 0 ? 200 : 404).json({
          status: result.deletedCount > 0 ? "success" : "fail",
          message:
            result.deletedCount > 0
              ? "Simple token deleted successfully. Logout completed."
              : "Simple token not found. It may have already been logged out.",
        });

      case "Bearer":
        await blacklistToken(tokenValue);

        return res.status(200).json({
          status: "success",
          message: "JWT blacklisted successfully. Logout completed.",
        });

      default:
        return res.status(400).json({
          status: "fail",
          message: `Unsupported token type '${tokenType}'. Use 'Token' or 'Bearer'.`,
        });
    }
  },

  forgotPassword: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Forgot Password"
        #swagger.description = 'Send a reset password token to the user’s registered email address.'
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                "email": "test@example.com"
            }
        }
    */
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new CustomError("There is no user with email address.", 404);
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/auth/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendMail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
        resetToken,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new CustomError(
        "There was an error sending the email. Try again later!",
        500
      );
    }
  },

  resetPassword: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Reset Password"
        #swagger.description = 'Reset user password using a valid reset token.'
        #swagger.parameters["token"] = {
            in: "path",
            required: true,
            description: "Password reset token provided in the URL.",
            type: "string"
        }
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                "password": "newPassword123",
                "passwordConfirm": "newPassword123"
            }
        }
    */
    // 1) Get user based on the token
    const hashedToken = resetTokenHash(req.params.token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      throw new CustomError("Token is invalid or has expired", 400);
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user (handled in user model middleware)

    // 4) Log the user in, send Token

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
