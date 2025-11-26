const express = require("express");
const router = express.Router(); 

function createFreightRoutes(pool) {
  router.get("/", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 100;
      const offset = (page - 1) * limit;
      const client = await pool.connect();
      const dataQuery =
        'SELECT * FROM freight_list ORDER BY "fDate" DESC LIMIT $1 OFFSET $2';
      const dataResult = await client.query(dataQuery, [limit, offset]);
      const countQuery = "SELECT COUNT(*) FROM freight_list";
      const countResult = await client.query(countQuery);
      const totalCount = parseInt(countResult.rows[0].count);
      client.release();
      res.json({ data: dataResult.rows, totalCount: totalCount });
    } catch (err) {
      console.error("Error in /api/freight:", err);
      res
        .status(500)
        .json({ message: "Failed to get freight data!", error: err.message });
    }
  });


  return router; 
}

module.exports = createFreightRoutes; 
