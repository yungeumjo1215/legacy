const router = require("express").Router(); // express router import
const { deleteTask } = require("../controller/deleteTaskCtrl");

router.delete("/deleteTask/:taskId", deleteTask);

module.exports = router;
