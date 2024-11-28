const express = require("express");
const pool = require("../database/database");

const router = express.Router();

// Route to fetch heritage list
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM accounts;");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
