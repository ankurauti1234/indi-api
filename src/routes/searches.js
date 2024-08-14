const express = require("express");
const router = express.Router();
const Device = require("../../eventsModel");
const deviceAlertsSchema = require("../../alertsModel"); // Adjust path if needed

// routes/devices.js

// Get the latest device record within a specified ID range
router.get("/devices/search", async (req, res) => {
  try {
    // Extract query parameters
    const {
      deviceId,
      deviceIdMin,
      deviceIdMax,
      ipUp,
      lat,
      lon,
      installing,
      meterSuccess,
    } = req.query;

    // Build query object
    const query = {};
    if (deviceId) query.DEVICE_ID = deviceId;
    if (deviceIdMin && deviceIdMax)
      query.DEVICE_ID = { $gte: deviceIdMin, $lte: deviceIdMax };
    if (ipUp) query["NETWORK_LATCH.Ip_up"] = ipUp === "true"; // Convert to boolean
    if (lat && lon)
      query["LOCATION.Cell_Info"] = {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      };
    if (installing) query["LOCATION.Installing"] = installing === "true"; // Convert to boolean
    if (meterSuccess)
      query["METER_INSTALLATION.Success"] = meterSuccess === "true"; // Convert to boolean

    // Aggregation pipeline
    const results = await Device.aggregate([
      { $match: query }, // Match documents based on query
      { $sort: { timestamp: -1 } }, // Sort by timestamp in descending order
      {
        $group: {
          _id: "$DEVICE_ID", // Group by device ID
          latestEntry: { $first: "$$ROOT" }, // Get the first entry in the sorted order (i.e., latest)
        },
      },
      { $replaceRoot: { newRoot: "$latestEntry" } }, // Replace root with latest entry
      {
        $project: {
          DEVICE_ID: 1,
          "LOCATION.Cell_Info.lat": 1,
          "LOCATION.Cell_Info.lon": 1,
          "METER_INSTALLATION.HHID": 1,
          "METER_INSTALLATION.Success": 1,
          "NETWORK_LATCH.Ip_up": 1,
          "ALIVE.state": 1,
          "CONFIGURATION.software_version": 1,
          "NETWORK_LATCH.Sim": 1,
          "LOCATION.Installing": 1,
        },
      },
    ]).exec();

    // Map results to new field names
    const mappedResults = results.map((result) => ({
      meter_id: result.DEVICE_ID,
      lat: result.LOCATION?.Cell_Info?.lat,
      lon: result.LOCATION?.Cell_Info?.lon,
      hhid: result.METER_INSTALLATION?.HHID,
      hh_status: result.METER_INSTALLATION?.Success,
      connectivity_status: result.NETWORK_LATCH?.Ip_up,
      hw_version: result.CONFIGURATION?.software_version,
      active_sim: result.NETWORK_LATCH?.Sim,
      meter_status: result.LOCATION?.Installing,
      alive_state: result.ALIVE?.state,
    }));

    // Send response
    res.json(mappedResults);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// New API endpoint to search by deviceId only
router.get("/devices/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Aggregation pipeline to get the latest record for the specified deviceId
    const results = await Device.aggregate([
      { $match: { DEVICE_ID: deviceId } }, // Match documents with the specified deviceId
      { $sort: { timestamp: -1 } }, // Sort by timestamp in descending order
      {
        $project: {
          DEVICE_ID: 1,
          "LOCATION.Cell_Info.lat": 1,
          "LOCATION.Cell_Info.lon": 1,
          "METER_INSTALLATION.HHID": 1,
          "METER_INSTALLATION.Success": 1,
          "NETWORK_LATCH.Ip_up": 1,
          "ALIVE.state": 1,
          "CONFIGURATION.software_version": 1,
          "NETWORK_LATCH.Sim": 1,
          "LOCATION.Installing": 1,
        },
      },
    ]).exec();

    // Map results to new field names
    const mappedResults = results.map((result) => ({
      meter_id: result.DEVICE_ID,
      lat: result.LOCATION?.Cell_Info?.lat,
      lon: result.LOCATION?.Cell_Info?.lon,
      hhid: result.METER_INSTALLATION?.HHID,
      hh_status: result.METER_INSTALLATION?.Success,
      connectivity_status: result.NETWORK_LATCH?.Ip_up,
      hw_version: result.CONFIGURATION?.software_version,
      active_sim: result.NETWORK_LATCH?.Sim,
      meter_status: result.LOCATION?.Installing,
      alive_state: result.ALIVE?.state,
    }));

    // Send response
    if (mappedResults.length > 0) {
      res.json(mappedResults);
    } else {
      res.status(404).send("Device not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
