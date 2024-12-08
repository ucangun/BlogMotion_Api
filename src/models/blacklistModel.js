"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true }, // Token to identify the blacklisted JWT
  createdAt: { type: Date, default: Date.now }, // The creation date of the token
  expiresAt: { type: Date, required: true }, // The expiration date of the token
});

module.exports = mongoose.model("Blacklist", blacklistSchema);
