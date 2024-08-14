const express = require("express");
const router = express.Router();
const Device = require("../../eventsModel"); // Adjust the path as needed

// Helper function to determine APM type
function getAPMType(DEVICE_ID) {
  if (DEVICE_ID.startsWith("1")) return "APM1";
  if (DEVICE_ID.startsWith("2")) return "APM2";
  if (DEVICE_ID.startsWith("3")) return "APM3";
  return "Unknown";
}

// Get installed meters count
router.get("/installed", async (req, res) => {
  try {
    const result = await Device.aggregate([
      {
        $group: {
          _id: { $substr: ["$DEVICE_ID", 0, 1] },
          count: { $sum: 1 },
        },
      },
    ]);

    const response = {
      APM1: 0,
      APM2: 0,
      APM3: 0,
    };

    result.forEach((item) => {
      if (item._id === "1") response.APM1 = item.count;
      if (item._id === "2") response.APM2 = item.count;
      if (item._id === "3") response.APM3 = item.count;
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get connected meters count
router.get("/connected", async (req, res) => {
  try {
    const result = await Device.aggregate([
      {
        $match: { "ALIVE.state": true },
      },
      {
        $group: {
          _id: { $substr: ["$DEVICE_ID", 0, 1] },
          count: { $sum: 1 },
        },
      },
    ]);

    const response = {
      APM1: 0,
      APM2: 0,
      APM3: 0,
    };

    result.forEach((item) => {
      if (item._id === "1") response.APM1 = item.count;
      if (item._id === "2") response.APM2 = item.count;
      if (item._id === "3") response.APM3 = item.count;
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get EOD received count
router.get("/eod-received", async (req, res) => {
  // Assuming EOD received is based on some specific condition
  // You may need to adjust this based on your actual data model
  try {
    const result = await Device.aggregate([
      {
        $match: { AUDIENCE_SESSION_CLOSE: { $exists: true } },
      },
      {
        $group: {
          _id: { $substr: ["$DEVICE_ID", 0, 1] },
          count: { $sum: 1 },
        },
      },
    ]);

    const response = {
      APM1: 0,
      APM2: 0,
      APM3: 0,
    };

    result.forEach((item) => {
      if (item._id === "1") response.APM1 = item.count;
      if (item._id === "2") response.APM2 = item.count;
      if (item._id === "3") response.APM3 = item.count;
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get installed household count
router.get("/installed-household", async (req, res) => {
  try {
    const result = await Device.aggregate([
      {
        $match: { "METER_INSTALLATION.Success": true },
      },
      {
        $group: {
          _id: { $substr: ["$DEVICE_ID", 0, 1] },
          count: { $sum: 1 },
        },
      },
    ]);

    const response = {
      APM1: 0,
      APM2: 0,
      APM3: 0,
    };

    result.forEach((item) => {
      if (item._id === "1") response.APM1 = item.count;
      if (item._id === "2") response.APM2 = item.count;
      if (item._id === "3") response.APM3 = item.count;
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get time series data for the last 60 seconds (6 data points, 10 seconds each)
router.get("/time-series/:metric", async (req, res) => {
  const { metric } = req.params;
  const endTime = Date.now();
  const startTime = endTime - 60000; // 60 seconds ago

  try {
    let matchCondition = {};
    switch (metric) {
      case "installed":
        matchCondition = {};
        break;
      case "connected":
        matchCondition = { "ALIVE.state": true };
        break;
      case "eod-received":
        matchCondition = { AUDIENCE_SESSION_CLOSE: { $exists: true } };
        break;
      case "installed-household":
        matchCondition = { "METER_INSTALLATION.Success": true };
        break;
      default:
        return res.status(400).json({ error: "Invalid metric" });
    }

    const result = await Device.aggregate([
      {
        $match: {
          ...matchCondition,
          "LOCATION.TS": { $gte: startTime, $lte: endTime },
        },
      },
      {
        $group: {
          _id: {
            apmType: { $substr: ["$DEVICE_ID", 0, 1] },
            timeSlot: {
              $subtract: [
                { $toLong: "$LOCATION.TS" },
                { $mod: [{ $toLong: "$LOCATION.TS" }, 10000] },
              ],
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.apmType",
          timeSeries: {
            $push: {
              time: "$_id.timeSlot",
              count: "$count",
            },
          },
        },
      },
    ]);

    const response = {
      APM1: [],
      APM2: [],
      APM3: [],
    };

    result.forEach((item) => {
      const apmType = `APM${item._id}`;
      response[apmType] = item.timeSeries.map((point) => ({
        time: new Date(point.time).toISOString(),
        count: point.count,
      }));
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
