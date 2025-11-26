const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // POST: Save a new route
  router.post("/", async (req, res) => {
    try {
      const { origin, destination, waypoints, distance, duration, cost } =
        req.body;

      if (!origin || !destination) {
        return res
          .status(400)
          .json({ message: "Origin and Destination are required." });
      }

      const client = await pool.connect();
      const insertQuery = `
        INSERT INTO saved_routes (origin, destination, waypoints, distance, duration, cost)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      const result = await client.query(insertQuery, [
        origin,
        destination,
        waypoints || "",
        distance,
        duration,
        cost,
      ]);

      client.release();

      res.status(201).json({
        message: "Route saved successfully!",
        data: result.rows[0],
      });
    } catch (err) {
      console.error("Error saving route:", err);
      res
        .status(500)
        .json({ message: "Failed to save route", error: err.message });
    }
  });

  // GET: Fetch all saved routes (History)
  router.get("/", async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM saved_routes ORDER BY created_at DESC"
      );
      client.release();
      res.json({ data: result.rows });
    } catch (err) {
      console.error("Error fetching routes:", err);
      res
        .status(500)
        .json({ message: "Failed to fetch routes", error: err.message });
    }
  });

  return router;
};
