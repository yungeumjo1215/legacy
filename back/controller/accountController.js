const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/database");
const { v4: uuidv4 } = require("uuid");

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // Securely handle secret keys
// Utility function to validate passwords
const isValidPassword = (password) => {
  const specialCharRegex = /[!@#$%^&*]/;
  const lengthRegex = /.{8,}/;
  return specialCharRegex.test(password) && lengthRegex.test(password);
};

/**
 * Create a new account
 */
const createAccount = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one special character (!@#$%^&*).",
    });
  }

  try {
    // Check registration limit per domain
    const emailDomain = email.split("@")[1];
    const { rowCount } = await pool.query(
      "SELECT * FROM accounts WHERE email LIKE $1 AND created_at > NOW() - INTERVAL '1 day'",
      [`%@${emailDomain}`]
    );

    if (rowCount >= 3) {
      return res.status(429).json({
        message: "Registration limit exceeded for this email domain.",
      });
    }

    // Hash password and create account
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO accounts (email, username, password) VALUES ($1, $2, $3) RETURNING *",
      [email, username, hashedPassword]
    );

    return res.status(201).json({
      message: "Account created successfully.",
      account: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).json({
      message: "An error occurred while creating the account.",
    });
  }
};

/**
 * Login a user
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const result = await pool.query("SELECT * FROM accounts WHERE email = $1", [
      email,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Account not found." });
    }

    const account = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      {
        email: account.email,
        is_admin: account.is_admin,
        username: account.username,
      },
      SECRET_KEY,
      { expiresIn: "3h" }
    );

    await pool.query(
      "INSERT INTO login_log (admin_uuid, client_uuid, action) VALUES ($1, $2, $3)",
      [account.uuid, account.uuid, "LOGIN"]
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      account: {
        email: account.email,
        username: account.username,
        is_admin: account.is_admin,
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Logout a user
 */
const logout = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required to log out." });
  }

  try {
    const result = await pool.query("SELECT * FROM accounts WHERE email = $1", [
      email,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Account not found." });
    }

    const account = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    await pool.query(
      "INSERT INTO login_log (admin_uuid, client_uuid, action) VALUES ($1, $2, $3)",
      [account.uuid, account.uuid, "LOGOUT"]
    );

    res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error("Error during logout:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Delete an account
 */
const deleteAccount = async (req, res) => {
  const { uuid } = req.params;

  if (!uuid) {
    return res
      .status(400)
      .json({ message: "UUID is required to delete an account." });
  }

  try {
    // Log the delete action (set admin_uuid to NULL or skip entirely)
    await pool.query(
      "INSERT INTO login_log (admin_uuid, client_uuid, action) VALUES (NULL, $1, $2)",
      [uuid, "DELETE"]
    );

    // Delete the account
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

/**
 * Update account permissions
 */
const updateAccountPermissions = async (req, res) => {
  const { uuid } = req.params;
  const { update_account, delete_account } = req.body;

  if (!uuid) {
    return res
      .status(400)
      .json({ message: "UUID is required to update permissions." });
  }

  try {
    const result = await pool.query(
      "UPDATE mypage SET update_account = $1, delete_account = $2 WHERE uuid = $3 RETURNING *",
      [update_account, delete_account, uuid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Account not found." });
    }

    res.status(200).json({
      message: "Permissions updated successfully.",
      permissions: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating permissions:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createAccount,
  login,
  logout,
  deleteAccount,
  updateAccountPermissions,
};
