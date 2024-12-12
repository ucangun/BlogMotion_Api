"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

const cors = require("cors");
const scheduleBlacklistCleanup = require("./src/helpers/blacklistCleaner");
const express = require("express");
const app = express();

/* ------------------------------------------------- */

// envVariables to process.env:
require("dotenv").config();
const HOST = process.env?.HOST || "127.0.0.1";
const PORT = process.env?.PORT || 8000;

// asyncErrors to errorHandler:
require("express-async-errors");

/* ------------------------------------------------- */
// Configrations:

// DB Connection
const connectDB = require("./src/configs/dbConnection");
connectDB();

// Blacklist Cleaner
scheduleBlacklistCleanup();

/* ------------------------------------------------- */

// Middlewares:

// Cors
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Accept JSON:
app.use(express.json());

// Check Authentication:
app.use(require("./src/middlewares/authentication"));

// Run Logger:
// app.use(require("./src/middlewares/logger"));

// res.getModelList():
app.use(require("./src/middlewares/queryHandler"));

/* ------------------------------------------------- */

// Routes:

// HomePath:
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "Welcome to BlogMotion Api",
    documents: {
      swagger: "/documents/swagger",
      redoc: "/documents/redoc",
      json: "/documents/json",
    },
  });
});

// Routes:
app.use(require("./src/routes/index"));

/* ------------------------------------------------- */

// errorHandler:
app.use(require("./src/middlewares/errorHandler"));

/* ------------------------------------------------- */

// RUN SERVER:
app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

/* ------------------------------------------------------- */
