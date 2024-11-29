const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/database");
const { v4: uuidv4 } = require("uuid");

const SECRET_KEY = "your_secret_key"; // Replace with a secure key

// Utility function to validate passwords
const isValidPassword = (password) => {
  const specialCharRegex = /[!@#$%^&*]/;
  const lengthRegex = /.{8,}/;

  return specialCharRegex.test(password) && lengthRegex.test(password);
};

// Create a new account
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const uuid = uuidv4();

    // Insert into accounts table
    const result = await pool.query(
      "INSERT INTO accounts (uuid, email, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [uuid, email, username, hashedPassword]
    );

    // Insert default permissions into mypage table
    await pool.query(
      "INSERT INTO mypage (uuid, update_account, delete_account) VALUES ($1, $2, $3)",
      [uuid, false, false]
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
      return res.status(409).json({ message: "Email already exists." });
    }
    console.error("Error creating account:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Fetch the user account using email
    const result = await pool.query("SELECT * FROM accounts WHERE email = $1", [
      email,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Account not found." });
    }

    const account = result.rows[0];

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        email: account.email,
        is_admin: account.is_admin,
        username: account.username,
      },
      SECRET_KEY,
      { expiresIn: "3h" } // Token expires in 3 hour
    );

    console.log(token);

    // Log the login action
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

// Logout a user
const logout = async (req, res) => {
  const { uuid } = req.user;

  try {
    // Log logout action
    await pool.query(
      "INSERT INTO login_log (admin_uuid, client_uuid, action) VALUES ($1, $2, $3)",
      [uuid, uuid, "LOGOUT"]
    );

    res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error("Error during logout:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete an account
const deleteAccount = async (req, res) => {
  const { uuid } = req.params;

  if (!uuid) {
    return res
      .status(400)
      .json({ message: "UUID is required to delete an account." });
  }

  try {
    const adminUuid = req.user.uuid; // Assuming admin UUID is available via middleware

    // Log the delete action
    await pool.query(
      "INSERT INTO login_log (admin_uuid, client_uuid, action) VALUES ($1, $2, $3)",
      [adminUuid, uuid, "DELETE"]
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

// Update account permissions
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
