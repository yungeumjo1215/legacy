const express = require("express");
const pool = require("../database/database");

const router = express.Router();

// Route to fetch heritage list
router.get("/accounts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM accounts;");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/heritage", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM heritagelist;");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/festivals", async (req, res) => {
  try {
    // Fetch data from the database
    const result = await pool.query("SELECT * FROM festivalsearch;");

    // Transform database rows if needed (optional based on your use case)
    const transformedResults = result.rows.map((row) => ({
      programName: [row.제목] || "N/A",
      programContent: [row.내용] || "N/A",
      startDate: [row.시작일] || "N/A",
      endDate: [row.종료일] || "N/A",
      location: [row.장소] || "N/A",
      contact: [row.연락처] || "N/A",
      sido: [row.시도] || "N/A",
      targetAudience: [row.대상] || "N/A",
      imageUrl: [row.이미지] || "N/A",
    }));

    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;

    res.json({ year, month, transformedResults });
  } catch (err) {
    console.error("Error fetching festivals:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
