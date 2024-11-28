const pool = require("../database/database");

// Controller to create a new account
const createAccount = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO accounts (email, username, password) VALUES ($1, $2, $3) RETURNING *",
      [email, username, password]
    );

    res.status(201).json({
      message: "Account created successfully.",
      account: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      // PostgreSQL unique_violation error code
      return res.status(409).json({ message: "Email already exists." });
    }
    console.error("Error creating account:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to delete an account
const deleteAccount = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required to delete an account." });
  }

  try {
    const result = await pool.query(
      "DELETE FROM accounts WHERE email = $1 RETURNING *",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Account not found." });
    }

    res.status(200).json({
      message: "Account deleted successfully.",
      account: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting account:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { createAccount, deleteAccount };
