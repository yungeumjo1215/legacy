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

    // Transform database rows if needed (optional based on your use case)
    const transformedResults = result.rows.map((row) => ({
      programName: [row.subTitle] || "N/A",
      programContent: [row.subContent] || "N/A",
      startDate: [row.sDate] || "N/A",
      endDate: [row.eDate] || "N/A",
      location: [row.subDesc] || "N/A",
      contact: [row.contact] || "N/A",
      sido: [row.sido] || "N/A",
      targetAudience: [row.subDesc2] || "N/A",
      imageUrl: [row.imageUrl] || "N/A",
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

// 즐겨찾기 추가
router.post("/favorites", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const {
      programName,
      programContent,
      location,
      startDate,
      endDate,
      targetAudience,
      contact,
      imageUrl,
    } = req.body;

    const query = `
      INSERT INTO favoritelist (
        token, programName, programContent, location, 
        startDate, endDate, targetAudience, contact, imageUrl
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      token,
      programName,
      programContent,
      location,
      startDate,
      endDate,
      targetAudience,
      contact,
      imageUrl,
    ];

    const result = await pool.query(query, values);
    res.json({
      type: req.body.type,
      ...result.rows[0],
    });
  } catch (err) {
    console.error("Error adding to favorites:", err.message);
    res.status(500).send("Server Error");
  }
});

// 즐겨찾기 목록 조회
router.get("/favorites", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const result = await pool.query(
      "SELECT * FROM favoritelist WHERE token = $1",
      [token]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching favorites:", err.message);
    res.status(500).send("Server Error");
  }
});

// 즐겨찾기 삭제
router.delete("/favorites/:id", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM favoritelist WHERE id = $1 AND token = $2 RETURNING *",
      [id, token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "즐겨찾기를 찾을 수 없습니다." });
    }

    res.json({ message: "즐겨찾기가 삭제되었습니다." });
  } catch (err) {
    console.error("Error deleting favorite:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
