const mongoose = require("mongoose");

const devAlertSchema = new mongoose.Schema({
  ID: { type: Number }, // Event type
  DEVICE_ID: { type: Number, required: true },
  AlertType: { type: String, required: true },
  Type: { type: Number }, // Event type
  TS: { type: Number }, // Timestamp of the alert
  Details: { type: mongoose.Schema.Types.Mixed }, // Details of the alert
});

const deviceAlertsSchema = mongoose.model(
  "deviceAlerts",
  devAlertSchema,
  "iot_device_alert"
);

module.exports = deviceAlertsSchema;
