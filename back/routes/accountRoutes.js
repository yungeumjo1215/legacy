const express = require("express");
const {
  createAccount,
  deleteAccount,
} = require("../controller/accountController");

const router = express.Router();

// Route for creating an account
router.post("/create", createAccount);

// Route for deleting an account by UUID
router.delete("/delete/:uuid", deleteAccount);

module.exports = router;
