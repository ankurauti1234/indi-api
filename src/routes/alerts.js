// routes/alerts.js
const express = require("express");
const router = express.Router();
const deviceAlertsSchema = require("../../alertsModel"); // Adjust path if needed

// Get all alerts
router.get("/alerts", async (req, res) => {
  try {
    const alerts = await deviceAlertsSchema.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all devices by AlertType
router.get("/devices/by-alert-type", async (req, res) => {
  const { alertType } = req.query;
  try {
    const records = await deviceAlertsSchema.find({ AlertType: alertType });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get alerts by device ID
router.get("/alerts/device/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const alerts = await deviceAlertsSchema.find({ DEVICE_ID: deviceId });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
