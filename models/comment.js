const mongoose = require("mongoose");

const Comment = new mongoose.Schema({
  content: { type: String, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project"},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model("Comment", Comment);