const express = require("express");
const {
  createAccount,
  deleteAccount,
  login,
  logout,
  updateAccountPermissions,
  getUserInfo,
} = require("../controller/accountController");
const { authenticate } = require("../utils/authenticate"); // Middleware for authentication

const router = express.Router();

// Route for creating an account
router.post("/create", createAccount);

// Route for deleting an account by UUID (protected route)
router.delete("/delete/:uuid", deleteAccount);

// Route for logging in
router.post("/login", login);

// Route for logging out (protected route)
router.post("/logout", logout);

// Route for updating account permissions (protected route)
router.put("/permissions/:uuid", authenticate, updateAccountPermissions);

// Route for getting user information (protected route)
router.get("/info", authenticate, getUserInfo);

module.exports = router;
