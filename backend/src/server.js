const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { pool } = require("./db");
const peopleRoutes = require("./routes/peopleRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.status(200).json({ status: "ok", db: "connected" });
  } catch (err) {
    return res.status(500).json({ status: "error", db: "disconnected" });
  }
});

app.use("/api/people", peopleRoutes);

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});

