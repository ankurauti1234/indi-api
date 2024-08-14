const express = require("express");
const cors = require("cors"); // Import cors
const connectDB = require("./src/config/mongoDB");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const alertsRouter = require("./src/routes/alerts");
const locationsRouter = require("./src/routes/locations");
const devicesRoutes = require("./src/routes/devices");
const searchesRoutes = require("./src/routes/searches");
require("dotenv").config();

const app = express();
connectDB();

app.use(express.json());

// Use cors middleware
app.use(
  cors({
    origin: "*", // You can specify a specific origin instead of "*", e.g., "http://localhost:3000"
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api", alertsRouter);
app.use("/api", locationsRouter);
app.use("/api", devicesRoutes);
app.use("/api", searchesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
