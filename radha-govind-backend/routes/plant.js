const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // This path is now relative to '/api/plant'
  router.get("/", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 100;
      const offset = (page - 1) * limit;
      const client = await pool.connect();
      const dataQuery = `
        SELECT 
          name, party, gstNo, location, address, "Handler Name", "Handler Mobile", "Handler E-Mail"
        FROM plant_list 
        ORDER BY name ASC 
        LIMIT $1 OFFSET $2
      `;
      const dataResult = await client.query(dataQuery, [limit, offset]);
      const countQuery = "SELECT COUNT(*) FROM plant_list";
      const countResult = await client.query(countQuery);
      const totalCount = parseInt(countResult.rows[0].count);
      client.release();
      res.json({
        data: dataResult.rows,
        totalCount: totalCount,
      });
    } catch (err) {
      console.error("Error in /api/plant:", err);
      res.status(500).json({
        message: "Failed to get plant data!",
        error: err.message,
      });
    }
  });

  // Namma munnadi create panna POST route
  router.post("/", async (req, res) => {
    try {
      const { name, party, location, address, coords } = req.body;
      if (!name || !party || !location || !address) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields." });
      }
      const client = await pool.connect();
      const insertQuery = `
        INSERT INTO plant_list (name, party, location, address, coords)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *; 
      `;
      const coordsString = coords ? `${coords.lat},${coords.lng}` : null;
      const result = await client.query(insertQuery, [
        name,
        party,
        location,
        address,
        coordsString,
      ]);
      client.release();
      res
        .status(201)
        .json({
          message: "Location added successfully!",
          data: result.rows[0],
        });
    } catch (err) {
      console.error("Error in POST /api/plant:", err);
      res
        .status(500)
        .json({ message: "Failed to add location!", error: err.message });
    }
  });

  return router;
};
