// routes/locations.js
const express = require("express");
const router = express.Router();
const Device = require("../../eventsModel"); // Adjust path if needed

// Helper function to find devices with ID starting with a specific prefix
const findDevicesByIdPrefix = async (prefix) => {
  return Device.find(
    {
      DEVICE_ID: { $regex: `^${prefix}` },
      "LOCATION.Cell_Info": { $exists: true }, // Ensure LOCATION.Cell_Info field exists
    },
    {
      DEVICE_ID: 1,
      "LOCATION.Cell_Info.lat": 1,
      "LOCATION.Cell_Info.lon": 1,
    }
  ).lean(); // Use lean to get plain JavaScript objects
};

// Get locations for devices with ID starting with 1
router.get("/locations/prefix/1", async (req, res) => {
  try {
    const devices = await findDevicesByIdPrefix("1");
    // Transform data to only include DEVICE_ID and lat, lon
    const locations = devices.map((device) => ({
      DEVICE_ID: device.DEVICE_ID,
      lat: device.LOCATION.Cell_Info.lat,
      lon: device.LOCATION.Cell_Info.lon,
    }));
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get locations for devices with ID starting with 2
router.get("/locations/prefix/2", async (req, res) => {
  try {
    const devices = await findDevicesByIdPrefix("2");
    // Transform data to only include DEVICE_ID and lat, lon
    const locations = devices.map((device) => ({
      DEVICE_ID: device.DEVICE_ID,
      lat: device.LOCATION.Cell_Info.lat,
      lon: device.LOCATION.Cell_Info.lon,
    }));
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get locations for devices with ID starting with 3
router.get("/locations/prefix/3", async (req, res) => {
  try {
    const devices = await findDevicesByIdPrefix("3");
    // Transform data to only include DEVICE_ID and lat, lon
    const locations = devices.map((device) => ({
      DEVICE_ID: device.DEVICE_ID,
      lat: device.LOCATION.Cell_Info.lat,
      lon: device.LOCATION.Cell_Info.lon,
    }));
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all locations
router.get("/locations", async (req, res) => {
  try {
    const devices = await Device.find(
      { "LOCATION.Cell_Info": { $exists: true } },
      {
        DEVICE_ID: 1,
        "LOCATION.Cell_Info.lat": 1,
        "LOCATION.Cell_Info.lon": 1,
      }
    ).lean(); // Use lean to get plain JavaScript objects
    // Transform data to only include DEVICE_ID and lat, lon
    const locations = devices.map((device) => ({
      DEVICE_ID: device.DEVICE_ID,
      lat: device.LOCATION.Cell_Info.lat,
      lon: device.LOCATION.Cell_Info.lon,
    }));
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
