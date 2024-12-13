const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode"); // Import jwt-decode
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "인증 토큰이 필요합니다." });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; // 디코딩된 사용자 정보를 요청 객체에 저장
      next();
    } catch (err) {
      console.error("Token verification error:", err);
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "토큰이 만료되었습니다. 다시 로그인해주세요." });
      }
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(500)
      .json({ message: "인증 처리 중 오류가 발생했습니다." });
  }
};

const decodeJWT = (token) => {
  try {
    if (!token || typeof token !== "string" || token.split(".").length !== 3) {
      throw new Error(
        "Invalid token format. JWT must have three parts separated by dots."
      );
    }
    const decoded = jwtDecode(token); // Decode the token without verifying
    console.log("Decoded JWT:", decoded); // Log the decoded token
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error.message);
    return null; // Return null if decoding fails
  }
};

module.exports = { authenticate, decodeJWT };
