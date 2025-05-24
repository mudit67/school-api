const express = require("express");
const { testConnection } = require("./configs/dbConfig");
const School = require("./models/school");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API Routes
app.get("/status", async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: "OK",
    database: dbConnected ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});
app.get("/api/schools", async (req, res) => {
  console.log("Fetching All Of the Schools.");
  try {
    const schools = await School.findAll();
    res.json({
      success: true,
      count: schools.length,
      data: schools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching schools",
      error: error.message,
    });
  }
});
app.get("/api/closest-school", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude are required.",
      });
    }
    const schools = await School.findClosetSchool(latitude, longitude);
    res.json({
      success: true,
      count: schools.length,
      data: schools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching schools",
      error: error.message,
    });
  }
});

app.post("/api/add-school", async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Basic validation
    if (
      !name ||
      !address ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, address, latitude, longitude",
      });
    }

    const schoolId = await School.create({
      name,
      address,
      latitude,
      longitude,
    });
    const newSchool = await School.findById(schoolId);

    res.status(201).json({
      success: true,
      message: "School created successfully",
      data: newSchool,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating school",
      error: error.message,
    });
  }
});

async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("Cannot start server: Database connection failed");
      process.exit(1);
    }

    // await School.deleteTable();

    await School.createTable();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Status check: http://localhost:${PORT}/status`);
      console.log(`Schools API: http://localhost:${PORT}/api/schools`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
