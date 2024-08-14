const express = require("express");
const router = express.Router();
const Device = require("../../eventsModel"); // Adjust path if needed

// Helper function to find records by device ID prefix and field
const findRecordsByIdPrefix = async (prefix, field) => {
  return Device.find(
    {
      DEVICE_ID: { $regex: `^${prefix}` },
      [field]: { $exists: true }, // Ensure the field exists
    },
    { DEVICE_ID: 1, [field]: 1 }
  ); // Return DEVICE_ID and the specified field
};

// Get all AUDIENCE_SESSION_CLOSE records
router.get("/audience-session-close", async (req, res) => {
  try {
    const records = await Device.find(
      { AUDIENCE_SESSION_CLOSE: { $exists: true } },
      { DEVICE_ID: 1, AUDIENCE_SESSION_CLOSE: 1 } // Include DEVICE_ID and AUDIENCE_SESSION_CLOSE
    );
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get AUDIENCE_SESSION_CLOSE records by device type
router.get("/audience-session-close/:deviceType", async (req, res) => {
  const deviceTypePrefix = req.params.deviceType;
  const devicePrefixMap = {
    APM1: "1",
    APM2: "2",
    APM3: "3",
  };

  const prefix = devicePrefixMap[deviceTypePrefix];
  if (!prefix) {
    return res.status(400).json({ message: "Invalid device type" });
  }

  try {
    const records = await findRecordsByIdPrefix(
      prefix,
      "AUDIENCE_SESSION_CLOSE"
    );
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all METER_INSTALLATION records
router.get("/meter-installation", async (req, res) => {
  try {
    const records = await Device.find(
      { METER_INSTALLATION: { $exists: true } },
      { DEVICE_ID: 1, METER_INSTALLATION: 1 } // Include DEVICE_ID and METER_INSTALLATION
    );
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get METER_INSTALLATION records by device type
router.get("/meter-installation/:deviceType", async (req, res) => {
  const deviceTypePrefix = req.params.deviceType;
  const devicePrefixMap = {
    APM1: "1",
    APM2: "2",
    APM3: "3",
  };

  const prefix = devicePrefixMap[deviceTypePrefix];
  if (!prefix) {
    return res.status(400).json({ message: "Invalid device type" });
  }

  try {
    const records = await findRecordsByIdPrefix(prefix, "METER_INSTALLATION");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all NETWORK_LATCH records
router.get("/network-latch", async (req, res) => {
  try {
    const records = await Device.find(
      { NETWORK_LATCH: { $exists: true } },
      { DEVICE_ID: 1, NETWORK_LATCH: 1 } // Include DEVICE_ID and NETWORK_LATCH
    );
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get NETWORK_LATCH records by device type
router.get("/network-latch/:deviceType", async (req, res) => {
  const deviceTypePrefix = req.params.deviceType;
  const devicePrefixMap = {
    APM1: "1",
    APM2: "2",
    APM3: "3",
  };

  const prefix = devicePrefixMap[deviceTypePrefix];
  if (!prefix) {
    return res.status(400).json({ message: "Invalid device type" });
  }

  try {
    const records = await findRecordsByIdPrefix(prefix, "NETWORK_LATCH");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
