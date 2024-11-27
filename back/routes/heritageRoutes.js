const express = require("express");
const { getHeritageList } = require("../controller/heritageController");

const router = express.Router();

// Route to fetch heritage list
router.get("/", getHeritageList);

module.exports = router;
