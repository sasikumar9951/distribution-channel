const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (pool) => {
  // POST /api/auth/login
  router.post("/login", async (req, res) => {
    try {
      // 1. Frontend la irunthu email/password ah vaangurom
      const { email, password } = req.body;

      // 2. Database la antha email irukka nu thedurom
      const userQuery = "SELECT * FROM users WHERE email = $1";
      const userResult = await pool.query(userQuery, [email]);

      if (userResult.rows.length === 0) {
        // User ah kandupudika mudiyala na
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = userResult.rows[0];

      // 3. Password correct ah nu check panrom
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        // Password thappu na
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // 4. Ellam correct ah iruntha, oru Token create panrom
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "UNGA_SECRET_KEY_INGA_PODUNGA", // Itha .env la vekkanum
        { expiresIn: "1h" } // 1 hour la intha token expire aagidum
      );

      // 5. Token ah frontend ku anuppurom
      res.json({ message: "Login successful!", token: token, name: user.name });
    } catch (err) {
      console.error("Error in /api/auth/login:", err);
      res.status(500).json({
        message: "Login failed!",
        error: err.message,
      });
    }
  });

  return router;
};
