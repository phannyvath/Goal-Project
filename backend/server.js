const express = require("express");
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");

const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging
console.log("Initializing routes...");

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));

console.log("Routes initialized successfully");

// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, () =>
  console.log(`Server started on port ${port}`.green.bold)
);
