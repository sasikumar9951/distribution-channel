require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

// 1. Create the database connection pool
if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set.");
  process.exit(1);
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 2. Test DB Route
app.get("/test-db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    res.json({
      message: "Database connection successful!",
      time: result.rows[0].now,
    });
    client.release();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({
      message: "Database connection failed!",
      error: err.message,
    });
  }
});

// 3. Import Routes
const freightRouter = require("./routes/freight")(pool);
const partyRouter = require("./routes/party")(pool);
const transportRouter = require("./routes/transport")(pool);
const plantRouter = require("./routes/plant")(pool);
const masterDataRouter = require("./routes/master-data")(pool);
const authRouter = require("./routes/auth")(pool);
const savedRoutesRouter = require("./routes/saved-routes")(pool); // NEW IMPORT

// 4. Use Routes
app.use("/api/freight", freightRouter);
app.use("/api/party", partyRouter);
app.use("/api/transport", transportRouter);
app.use("/api/plant", plantRouter);
app.use("/api/master-data", masterDataRouter);
app.use("/api/auth", authRouter);
app.use("/api/saved-routes", savedRoutesRouter); // NEW ROUTE

// 5. Start Server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
