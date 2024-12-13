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
    const result = await pool.query("SELECT * FROM festivallist;");

    const cleanDate = (dateString) => {
      if (!dateString) return "N/A"; // Handle empty or undefined dates
      return dateString.replace(/-/g, ""); // Remove hyphens only
    };
    // Transform database rows if needed (optional based on your use case)
    const transformedResults = result.rows.map((row) => ({
      programName: [row.programname] || "N/A",
      programContent: [row.programcontent] || "N/A",
      startDate: [cleanDate(row.startdate)] || "N/A",
      endDate: [cleanDate(row.enddate)] || "N/A",
      location: [row.location] || "N/A",
      contact: [row.contact] || "N/A",
      sido: [row.sido] || "N/A",
      targetAudience: [row.targetaudience] || "N/A",
      imageUrl: [row.imageurl] || "N/A",
    }));

    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;

    res.json({ year, month, transformedResults });
  } catch (err) {
    console.error("Error fetching festivals:", err.message);
    res.status(500).send("Server Error");
  }
});

//즐겨찾기 테스트 get
router.get("/favoritestest", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM favoritelist;");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
