const pool = require("../database/database");

exports.addFavorite = async (req, res) => {
  const { email, eventName, eventType } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO favorites (user_id, event_name, event_type) VALUES ($1, $2, $3) RETURNING *",
      [email, eventName, eventType]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Error adding favorite" });
  }
};

exports.removeFavorite = async (req, res) => {
  const { email, eventName } = req.params;

  try {
    await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND event_name = $2",
      [email, eventName]
    );

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: "Error removing favorite" });
  }
};

exports.getUserFavorites = async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC",
      [email]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Error fetching favorites" });
  }
};

exports.storeFavorites = async (req, res) => {
  const { favoriteFestivals, favoriteHeritages } = req.body;

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Insert favorite festivals
    if (favoriteFestivals && favoriteFestivals.length) {
      for (const festival of favoriteFestivals) {
        const { programName } = festival;

        if (!programName) {
          throw new Error("Festival entry missing required 'programName'");
        }

        await pool.query(
          "INSERT INTO favorites (eventname, eventtype) VALUES ($1, $2)",
          [programName, "festival"]
        );
      }
    }

    // Insert favorite heritages
    if (favoriteHeritages && favoriteHeritages.length) {
      for (const heritage of favoriteHeritages) {
        const { ccbaMnm1 } = heritage;

        if (!ccbaMnm1) {
          throw new Error("Heritage entry missing required 'ccbaMnm1'");
        }

        await pool.query(
          "INSERT INTO favorites (eventname, eventtype) VALUES ($1, $2)",
          [ccbaMnm1, "heritage"]
        );
      }
    }

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(200).json({ message: "Favorites stored successfully" });
  } catch (error) {
    // Rollback transaction on error
    await pool.query("ROLLBACK");

    console.error("Error storing favorites:", error.message);
    res
      .status(500)
      .json({ message: "Error storing favorites", error: error.message });
  }
};

// Retrieve favorites from the database
exports.showFavorites = async (req, res) => {
  try {
    // Fetch all favorites from the database
    const result = await pool.query(
      "SELECT eventname, eventtype FROM favorites"
    );

    // Check if data exists
    if (!result.rows.length) {
      return res
        .status(200)
        .json({ message: "No favorites found.", favorites: [] });
    }

    // Organize results into categories
    const favorites = result.rows.reduce(
      (acc, item) => {
        if (item.eventtype === "festival") {
          acc.favoriteFestivals.push(item.eventname);
        } else if (item.eventtype === "heritage") {
          acc.favoriteHeritages.push(item.eventname);
        }
        return acc;
      },
      { favoriteFestivals: [], favoriteHeritages: [] }
    );

    // Return organized favorites
    res
      .status(200)
      .json({ message: "Favorites retrieved successfully", favorites });
  } catch (error) {
    console.error("Error retrieving favorites:", error.message);
    res
      .status(500)
      .json({ message: "Error retrieving favorites", error: error.message });
  }
};
