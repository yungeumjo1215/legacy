const express = require("express");
const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
} = require("../controller/favoriteController");
const { authenticate } = require("../utils/authenticate");

const router = express.Router();

router.post("/", authenticate, addFavorite);
router.delete("/:userId/:eventName", authenticate, removeFavorite);
router.get("/:userId", authenticate, getUserFavorites);

module.exports = router;