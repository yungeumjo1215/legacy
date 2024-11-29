const express = require("express");
const {
  createAccount,
  deleteAccount,
  login,
  logout,
  updateAccountPermissions,
} = require("../controller/accountController");
const { authenticate } = require("../utils/authenticate"); // Middleware for authentication

const router = express.Router();

// Route for creating an account
router.post("/create", createAccount);

// Route for deleting an account by UUID (protected route)
router.delete("/delete/:uuid", authenticate, deleteAccount);

// Route for logging in
router.post("/login", login);

// Route for logging out (protected route)
router.post("/logout", authenticate, logout);

// Route for updating account permissions (protected route)
router.put("/permissions/:uuid", authenticate, updateAccountPermissions);

module.exports = router;
