const router = require("express").Router(); // express router import
const { getTasks } = require("../controller/getTasksCtrl");

router.get("/getTasks/:userId", getTasks); // userId는 다이나믹 문자열을 지정할때 앞에 콜론 사용

module.exports = router;
