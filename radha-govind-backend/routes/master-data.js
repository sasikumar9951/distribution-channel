const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // This path is now relative to '/api/master-data'
  router.get("/", async (req, res) => {
    let client;
    try {
      client = await pool.connect();

      const partyTypes = await client.query(
        "SELECT * FROM master_party_types ORDER BY name"
      );
      const businessTypes = await client.query(
        "SELECT * FROM master_business_types ORDER BY name"
      );
      const msmeStatus = await client.query(
        "SELECT * FROM master_msme_status ORDER BY name"
      );
      const items = await client.query(
        "SELECT * FROM master_items ORDER BY name"
      );
      const groups = await client.query(
        "SELECT * FROM master_groups ORDER BY name"
      );
      const lorryTypes = await client.query(
        "SELECT * FROM master_lorry_types ORDER BY name"
      );
      const loadings = await client.query(
        "SELECT * FROM master_loadings ORDER BY name"
      );
      const destinations = await client.query(
        "SELECT * FROM master_destinations ORDER BY name"
      );

      res.json({
        partyTypes: partyTypes.rows,
        businessTypes: businessTypes.rows,
        msmeStatus: msmeStatus.rows,
        items: items.rows,
        groups: groups.rows,
        lorryTypes: lorryTypes.rows,
        loadings: loadings.rows,
        destinations: destinations.rows,
      });
    } catch (err) {
      console.error("Error in /api/master-data:", err);
      res.status(500).json({
        message: "Failed to get master data!",
        error: err.message,
      });
    } finally {
      if (client) {
        client.release();
      }
    }
  });

  return router;
};
