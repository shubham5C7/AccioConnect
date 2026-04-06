// models/UserHistory.js
const mongoose = require("mongoose");

const userHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  device: String,     // from user-agent
  browser: String,
  os: String,

  ip: String,
  location: {
    city: String,
    country: String,
    lat: Number,
    lng: Number
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("UserHistory", userHistorySchema);