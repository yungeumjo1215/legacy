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
