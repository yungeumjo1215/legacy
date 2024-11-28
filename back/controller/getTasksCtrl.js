const database = require("../database/database"); // data import

exports.getTasks = async (request, response) => {
  const userId = request.params.userId;
  try {
    const result = await database.pool.query(
      "SELECT * FROM tasks WHERE userId = $1 ORDER BY created_at DESC",
      [userId]
    );

    return response.status(200).json(result.rows);
  } catch (error) {
    // 오류 응답 실패할떄 500 상태코드와 error 메시지로 응답
    return response.status(500).json({ msg: "GET TASKS  ERROR" + error });
  }
};
