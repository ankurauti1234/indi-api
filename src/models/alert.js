// models/Alert.js
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  ID: Number,
  DEVICE_ID: Number,
  AlertType: String,
  Type: Number,
  TS: Number,
  Details: { type: mongoose.Schema.Types.Mixed },
});

module.exports = mongoose.model("Alert", alertSchema);
