const pool = require("../database/database");
const { v4: uuidv4 } = require("uuid");

const isValidPassword = (password) => {
  const specialCharRegex = /[!@#$%^&*]/; // Must contain at least one special character
  const lengthRegex = /.{8,}/; // Minimum 8 characters long

  return specialCharRegex.test(password) && lengthRegex.test(password);
};
// Controller to create a new account
const createAccount = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username);

  // Validate input fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate password
  if (!isValidPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one special character (!@#$%^&*).",
    });
  }

  try {
    // Check registration limit (max 3 registrations per email domain per day)
    const emailDomain = email.split("@")[1];
    const { rowCount } = await pool.query(
      "SELECT * FROM accounts WHERE email LIKE $1 AND created_at > NOW() - INTERVAL '1 day'",
      [`%@${emailDomain}`]
    );

    if (rowCount >= 3) {
      return res.status(429).json({
        message:
          "Registration limit exceeded for this email domain. Please try again tomorrow.",
      });
    }

    // Create account with UUID
    const uuid = uuidv4();
    const result = await pool.query(
      "INSERT INTO accounts (uuid, email, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [uuid, email, username, password]
    );

    res.status(201).json({
      message: "Account created successfully.",
      account: {
        uuid: result.rows[0].uuid,
        email: result.rows[0].email,
        username: result.rows[0].username,
      },
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

const deleteAccount = async (req, res) => {
  const { uuid } = req.params;

  if (!uuid) {
    return res
      .status(400)
      .json({ message: "UUID is required to delete an account." });
  }

  try {
    const result = await pool.query(
      "DELETE FROM accounts WHERE uuid = $1 RETURNING *",
      [uuid]
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
