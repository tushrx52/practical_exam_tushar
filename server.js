require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(console.error);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(3000, () => console.log("Server running"));