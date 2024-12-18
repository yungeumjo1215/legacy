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
  // 특수문자 입력
  if (!isValidPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one special character (!@#$%^&*).",
    });
  }

  try {
    // Check registration limit per domain
    const emailDomain = email.split("@")[1];

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
      { expiresIn: "24h" }
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

/**
 * Get user information
 */
const getUserInfo = async (req, res) => {
  try {
    // Extract email from req.user (set by authenticate middleware)
    const email = req.user.email;

    console.log("Fetching user info for email:", email); // Debugging log

    // Fetch basic user information
    const userResult = await pool.query(
      `SELECT 
        email, 
        username, 
        created_at
       FROM accounts 
       WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Prepare user info structure
    const userInfo = {
      ...userResult.rows[0],
      favoriteHeritages: [],
      favoriteFestivals: [],
    };

    try {
      // Fetch favorites (heritages and festivals)
      const favoritesResult = await pool.query(
        `SELECT 
          "programName", 
          "programContent", 
          "location", 
          "startDate", 
          "endDate", 
          "targetAudience", 
          "contact", 
          "imageUrl", 
          "ccbamnm1", 
          "ccbalcad", 
          "content", 
          "imageurl", 
          "ccce_name"
         FROM favoritelist
         WHERE "token" = $1`,
        [email]
      );

      // Process heritages and festivals
      if (favoritesResult.rows.length > 0) {
        userInfo.favoriteFestivals = favoritesResult.rows
          .filter((f) => f.programName) // Filter rows where "programName" exists (festival)
          .map((f) => ({
            programName: f.programName,
            programContent: f.programContent,
            location: f.location,
            startDate: f.startDate,
            endDate: f.endDate,
            targetAudience: f.targetAudience,
            contact: f.contact,
            imageUrl: f.imageUrl,
          }));

        userInfo.favoriteHeritages = favoritesResult.rows
          .filter((f) => f.ccbamnm1) // Filter rows where "ccbamnm1" exists (heritage)
          .map((f) => ({
            ccbamnm1: f.ccbamnm1,
            ccbalcad: f.ccbalcad,
            content: f.content,
            imageurl: f.imageurl,
            ccce_name: f.ccce_name,
          }));
      }
    } catch (favoriteError) {
      console.error("Error fetching favoritelist:", favoriteError);
      // Return user info even if fetching favorites fails
    }

    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    res.status(500).json({
      message: "An error occurred on the server.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createAccount,
  login,
  logout,
  deleteAccount,
  updateAccountPermissions,
  getUserInfo,
};
