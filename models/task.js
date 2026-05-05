const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  dueDate: Date
});

taskSchema.index({ userId: 1, title: 1 }, { unique: true }); // prevent duplicate titles

module.exports = mongoose.model("Task", taskSchema);