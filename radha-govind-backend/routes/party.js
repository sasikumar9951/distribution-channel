const express = require("express");
const router = express.Router();

// This function accepts the 'pool' object from index.js
module.exports = (pool) => {
  // This path is now relative to '/api/party'
  router.get("/", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 100;
      const offset = (page - 1) * limit;
      const client = await pool.connect();
      const dataQuery = `
        SELECT 
          pname, bname, businesstype, partytype, address, local, city, state, 
          pincode, contactno, hname, desig, "hNo", email, msmestatus, items, "group"
        FROM party_list 
        ORDER BY pname ASC 
        LIMIT $1 OFFSET $2
      `;
      const dataResult = await client.query(dataQuery, [limit, offset]);
      const countQuery = "SELECT COUNT(*) FROM party_list";
      const countResult = await client.query(countQuery);
      const totalCount = parseInt(countResult.rows[0].count);
      client.release();
      res.json({ data: dataResult.rows, totalCount: totalCount });
    } catch (err) {
      console.error("Error in /api/party:", err);
      res.status(500).json({
        message: "Failed to get party data!",
        error: err.message,
      });
    }
  });

  return router;
};
