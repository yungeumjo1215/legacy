const database = require("../database/database");

exports.deleteTask = async (request, response) => {
  const taskId = request.params.taskId;

  try {
    const result = await database.pool.query(
      "DELETE FROM tasks WHERE _id = $1",
      [taskId]
    );
    return response.status(200).json({ msg: "Task deleted successfully" });
  } catch (error) {
    return response.status(500).json({ MSG: "Delete Task failed" + error });
  }
};
