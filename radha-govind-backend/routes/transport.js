const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // This path is now relative to '/api/transport'
  router.get("/", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 100;
      const offset = (page - 1) * limit;
      const client = await pool.connect();
      const dataQuery = `
        SELECT 
          tname, tnickname, city, state, hname, mobile, mobile2, landline, email, lorrytype, loadings, destinations 
        FROM transport_list 
        ORDER BY tname ASC 
        LIMIT $1 OFFSET $2
      `;
      const dataResult = await client.query(dataQuery, [limit, offset]);
      const countQuery = "SELECT COUNT(*) FROM transport_list";
      const countResult = await client.query(countQuery);
      const totalCount = parseInt(countResult.rows[0].count);
      client.release();
      res.json({
        data: dataResult.rows,
        totalCount: totalCount,
      });
    } catch (err) {
      console.error("Error in /api/transport:", err);
      res.status(500).json({
        message: "Failed to get transport data!",
        error: err.message,
      });
    }
  });

  return router;
};
