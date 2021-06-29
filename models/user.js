const mongoose = require("mongoose");

const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }]
});

module.exports = mongoose.model("User", User);