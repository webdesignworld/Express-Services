
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  totalScore: { type: Number, default: 0 },

});

module.exports = mongoose.model("User", UserSchema);
