"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 125,
    },
    content: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    image: {
      type: String,
      default: null,
    },
    isPublish: {
      type: Boolean,
      default: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    countOfVisitors: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "blogs",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.methods.incrementVisitors = async function () {
  this.countOfVisitors += 1;
  await this.save();
};

blogSchema.virtual("countInfo").get(function () {
  return {
    likesCount: this.likes.length,
    commentsCount: this.comments.length,
  };
});

module.exports = mongoose.model("Blog", blogSchema);
