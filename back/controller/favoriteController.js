const pool = require("../database/database");

// Store favorites in PostgreSQL
exports.storeFavorites = async (req, res) => {
  const { favoriteFestivals, favoriteHeritages } = req.body;
  const token = req.headers.token;

  if (!token) {
    return res.status(400).json({ message: "Token is required." });
  }

  if (!favoriteFestivals.length && !favoriteHeritages.length) {
    return res
      .status(400)
      .json({ message: "No data received from the client." });
  }

  try {
    await pool.query("BEGIN"); // Start transaction

    // Insert festivals
    for (const festival of favoriteFestivals) {
      const {
        programName,
        programContent,
        location,
        startDate,
        endDate,
        contact,
        targetAudience,
      } = festival;

      await pool.query(
        `INSERT INTO favorites 
        (token, eventtype, eventname, program_content, location, start_date, end_date, contact, target_audience)
        VALUES ($1, 'festival', $2, $3, $4, $5, $6, $7, $8)`,
        [
          token,
          programName,
          programContent,
          location,
          startDate,
          endDate,
          contact,
          targetAudience,
        ]
      );
    }

    // Insert heritages
    for (const heritage of favoriteHeritages) {
      const { ccbaMnm1, ccbaLcad, ccceName } = heritage;

      await pool.query(
        `INSERT INTO favorites 
        (token, eventtype, eventname, location, ccce_name)
        VALUES ($1, 'heritage', $2, $3, $4)`,
        [token, ccbaMnm1, ccbaLcad, ccceName]
      );
    }

    await pool.query("COMMIT"); // Commit transaction
    res
      .status(200)
      .json({ message: "Data stored successfully in PostgreSQL." });
  } catch (error) {
    await pool.query("ROLLBACK"); // Rollback transaction on error
    console.error("Error storing data:", error.message);
    res.status(500).json({
      message: "Error storing data in PostgreSQL.",
      error: error.message,
    });
  }
};

// Retrieve favorites from PostgreSQL
exports.showFavorites = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         eventtype, 
         eventname, 
         program_content, 
         location, 
         start_date, 
         end_date, 
         contact, 
         target_audience, 
         ccce_name, 
         token 
       FROM favorites`
    );

    if (!result.rows.length) {
      return res
        .status(200)
        .json({ message: "No favorites found.", favorites: [] });
    }

    const favorites = result.rows.reduce(
      (acc, item) => {
        if (item.eventtype === "festival") {
          acc.favoriteFestivals.push({
            programName: item.eventname,
            programContent: item.program_content,
            location: item.location,
            startDate: item.start_date,
            endDate: item.end_date,
            contact: item.contact,
            targetAudience: item.target_audience,
          });
        } else if (item.eventtype === "heritage") {
          acc.favoriteHeritages.push({
            ccbaMnm1: item.eventname,
            location: item.location,
            ccceName: item.ccce_name,
          });
        }
        return acc;
      },
      { favoriteFestivals: [], favoriteHeritages: [] }
    );

    res
      .status(200)
      .json({ message: "Favorites retrieved successfully.", favorites });
  } catch (error) {
    console.error("Error retrieving data:", error.message);
    res
      .status(500)
      .json({ message: "Error retrieving data.", error: error.message });
  }
};
