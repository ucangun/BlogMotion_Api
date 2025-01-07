"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const validatePassword = require("../helpers/validatePassword");
const resetTokenHash = require("../helpers/resetTokenHash");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },

    password: {
      type: String,
      required: function () {
        return this.googleId ? false : true;
      },
      validate: {
        validator: validatePassword,
        message:
          "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    firstName: {
      type: String,
      required: [true, "First name is required"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },

    image: {
      type: String,
      default: "default-avatar.jpg",
    },

    bio: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isStaff: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    verificationCode: Number,
    verificationCodeExpires: Date,
  },
  { collection: "users", timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.markAsVerified = async function () {
  this.isVerified = true;
  await this.save({ validateBeforeSave: false });
};

// userSchema.pre(/^find/, function (next) {
//   this.find({ isActive: true });
//   next();
// });

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = resetTokenHash(resetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createVerificationCode = function () {
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  this.verificationCode = verificationCode;

  this.verificationCodeExpires = Date.now() + 10 * 60 * 1000;

  return verificationCode;
};

userSchema.virtual("author").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("notes", {
  ref: "Notes",
  localField: "_id",
  foreignField: "userId",
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.id;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
