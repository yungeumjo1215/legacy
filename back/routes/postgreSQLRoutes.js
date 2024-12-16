const express = require("express");
const pool = require("../database/database");
const {
  executeTransaction,
  insertFavoriteFestivals,
  insertFavoriteHeritages,
  deleteFavoriteFestivals,
  deleteFavoriteHeritages,
} = require("../controller/favoriteController");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Use jwt for decoding
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded || !decoded.email) {
      throw new Error("Email not found in token payload.");
    }
    return decoded.email; // Return email from the decoded token
  } catch (err) {
    console.error("Token decoding error:", err.message);
    throw err; // Re-throw to indicate token is invalid
  }
}

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
      festivalid: [row.festivalid] || "N/A",
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

// router.get("/favoritelist", async (req, res) => {
//   try {
//     // Query all records from the favoritelist table
//     const result = await pool.query(`SELECT * FROM favoritelist;`);

//     // Filter festivals and heritages based on fields
//     const festivals = result.rows.filter(
//       (row) => row.programName && row.location
//     );
//     const heritages = result.rows.filter((row) => row.ccbamnm1 && row.ccbalcad);

//     // Respond with the filtered data
//     res.json({ festivals, heritages });
//   } catch (error) {
//     console.error("Error fetching favorites:", error.message);
//     res.status(500).json({ message: "Server error while fetching favorites." });
//   }
// });

router.get("/favoritelist", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token." });
  }

  try {
    const email = decodeToken(token);

    const result = await pool.query(
      `SELECT f_id, h_id, type FROM favoritelist WHERE token = $1`,
      [email]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error.message);
    res.status(500).json({ message: "Server error while fetching favorites." });
  }
});

// POST: Add Favorite Festivals and Heritages
router.post("/favoritelist", async (req, res) => {
  const { id, type } = req.body; // Extract ID and type
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  if (!token || !id || !type) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const email = decodeToken(token);

    if (type === "event") {
      await pool.query(
        `INSERT INTO favoritelist (token, f_id, type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [email, id, type]
      );
    } else if (type === "heritage") {
      await pool.query(
        `INSERT INTO favoritelist (token, h_id, type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [email, id, type]
      );
    }

    res.status(201).json({ message: "Favorite added successfully." });
  } catch (error) {
    console.error("Error adding favorite:", error.message);
    res.status(500).json({ message: "Server error while adding favorite." });
  }
});

// DELETE: Remove Favorite Festivals and Heritages
router.delete("/favoritelist", async (req, res) => {
  const { id, type } = req.body; // Extract ID and type
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  if (!token || !id || !type) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const email = decodeToken(token);

    if (type === "event") {
      await pool.query(
        `DELETE FROM favoritelist WHERE token = $1 AND f_id = $2 AND type = $3`,
        [email, id, type]
      );
    } else if (type === "heritage") {
      await pool.query(
        `DELETE FROM favoritelist WHERE token = $1 AND h_id = $2 AND type = $3`,
        [email, id, type]
      );
    }

    res.status(200).json({ message: "Favorite removed successfully." });
  } catch (error) {
    console.error("Error removing favorite:", error.message);
    res.status(500).json({ message: "Server error while removing favorite." });
  }
});

module.exports = router;
