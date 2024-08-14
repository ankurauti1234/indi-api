// routes/locations.js
const express = require("express");
const router = express.Router();
const Device = require("../../eventsModel"); // Adjust path if needed

// Helper function to find devices with ID starting with a specific prefix
const findDevicesByIdPrefix = async (prefix) => {
  return Device.find({
    DEVICE_ID: { $regex: `^${prefix}` },
    'LOCATION': { $exists: true } // Ensure LOCATION field exists
  }, { DEVICE_ID: 1, 'LOCATION': 1 }); // Return DEVICE_ID and LOCATION fields
};

// Get locations for devices with ID starting with 1
router.get('/locations/prefix/1', async (req, res) => {
  try {
    const locations = await findDevicesByIdPrefix('1');
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get locations for devices with ID starting with 2
router.get('/locations/prefix/2', async (req, res) => {
  try {
    const locations = await findDevicesByIdPrefix('2');
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get locations for devices with ID starting with 3
router.get('/locations/prefix/3', async (req, res) => {
  try {
    const locations = await findDevicesByIdPrefix('3');
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all locations
router.get('/locations', async (req, res) => {
  try {
    const locations = await Device.find(
      { 'LOCATION': { $exists: true } },
      { DEVICE_ID: 1, 'LOCATION': 1 } // Include DEVICE_ID and LOCATION
    );
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;