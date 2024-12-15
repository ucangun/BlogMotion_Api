"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

"use strict";

const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  { collection: "notes", timestamps: true }
);

module.exports = mongoose.model("Notes", notesSchema);
