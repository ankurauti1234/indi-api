// routes/devices.js
const express = require("express");
const router = express.Router();
const Device = require("../../eventsModel");
const deviceAlertsSchema = require("../../alertsModel"); // Adjust path if needed

// Get all devices by specific ID
router.get('/devices/by-id/:id', async (req, res) => {
  const deviceId = req.params.id;
  try {
    const records = await Device.find({ DEVICE_ID: deviceId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all devices by ID range
router.get('/devices/by-id-range', async (req, res) => {
  const { startId, endId } = req.query;
  try {
    const records = await Device.find({
      DEVICE_ID: { $gte: startId, $lte: endId }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all devices by NETWORK_LATCH.Ip_up
router.get('/devices/by-network-latch-ip-up', async (req, res) => {
  const { ipUp } = req.query;
  try {
    const records = await Device.find({ 'NETWORK_LATCH.Ip_up': ipUp });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all devices by AlertType
router.get('/devices/by-alert-type', async (req, res) => {
  const { alertType } = req.query;
  try {
    const records = await deviceAlertsSchema.find({ AlertType: alertType });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all devices by LOCATION.Cell_Info.lat and lon
router.get('/devices/by-location', async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const records = await Device.find({
      'LOCATION.Cell_Info.lat': lat,
      'LOCATION.Cell_Info.lon': lon
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;