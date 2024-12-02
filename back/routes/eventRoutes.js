const express = require("express");
const router = express.Router();
const eventController = require("../controller/eventController");

// Route for fetching events
router.get("/", eventController.getEvents);

module.exports = router;
