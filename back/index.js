const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const spawn = require("child_process").spawn;

// 라우트 임포트
const accountRoutes = require("./routes/accountRoutes");
const pgdbRoutes = require("./routes/postgreSQLRoutes");
const eventRoutes = require("./routes/eventRoutes");
const festivalRoutes = require("./routes/kgfestivalRoutes");

// Swagger 설정
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const PORT = 8000;
const app = express();

// 미들웨어 설정
dotenv.config();
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Swagger 설정
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "문화재/축제 API 문서",
  })
);

// 즐겨찾기 저장소
let storedFavorites = {
  favoriteFestivals: [],
  favoriteHeritages: [],
  token: null,
};
module.exports = storedFavorites;

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Server is running");
});

// 챗봇 라우트
app.post("/chat", (request, response) => {
  try {
    const { message } = request.body;

    if (!message) {
      return response.status(400).json({
        message: "메시지가 없습니다.",
      });
    }

    const scriptPath = path.join(__dirname, "chatbot.py");
    const pythonPath = "python";

    const result = spawn(pythonPath, [scriptPath, message]);
    let answer = "";
    let hasResponded = false;

    // 타임아웃 설정
    const timeout = setTimeout(() => {
      if (!hasResponded) {
        hasResponded = true;
        result.kill(); // 프로세스 종료
        response.status(504).json({
          message: "응답 시간이 초과되었습니다.",
        });
      }
    }, 30000); // 30초 타임아웃

    result.stdout.on("data", (data) => {
      answer += data.toString();
    });

    result.stderr.on("data", (data) => {
      const errorMsg = data.toString();
      if (!errorMsg.includes("USER_AGENT") && !hasResponded) {
        hasResponded = true;
        clearTimeout(timeout);
        console.error("Python Error:", errorMsg);
        response.status(500).json({
          message: "챗봇 처리 중 오류가 발생했습니다.",
        });
      }
    });

    result.on("close", (code) => {
      clearTimeout(timeout);
      if (!hasResponded) {
        hasResponded = true;
        if (code === 0 && answer.trim()) {
          response.status(200).json({
            message: answer.trim(),
          });
        } else {
          response.status(500).json({
            message: "응답을 생성하는 중 오류가 발생했습니다.",
          });
        }
      }
    });

    // 에러 이벤트 처리
    result.on("error", (error) => {
      clearTimeout(timeout);
      if (!hasResponded) {
        hasResponded = true;
        console.error("Process Error:", error);
        response.status(500).json({
          message: "서버 처리 중 오류가 발생했습니다.",
        });
      }
    });
  } catch (error) {
    console.error("Server Error:", error);
    if (!response.headersSent) {
      response.status(500).json({
        message: "서버 오류가 발생했습니다.",
      });
    }
  }
});

// API 라우트
app.use("/festival", festivalRoutes);
app.use("/pgdb", pgdbRoutes);
app.use("/event", eventRoutes);
app.use("/account", accountRoutes);

// 즐겨찾기 API
app.post("/api/store-favorites", (req, res) => {
  const { favoriteFestivals, favoriteHeritages } = req.body;
  const token = req.headers.token;

  if (!favoriteFestivals && !favoriteHeritages) {
    return res.status(400).json({ message: "데이터가 없습니다." });
  }

  storedFavorites.favoriteFestivals = favoriteFestivals;
  storedFavorites.favoriteHeritages = favoriteHeritages;
  storedFavorites.token = token;

  res.status(200).json({ message: "즐겨찾기가 저장되었습니다." });
});

app.get("/api/show-favorites", (req, res) => {
  res.status(200).json(storedFavorites);
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "서버 오류가 발생했습니다." });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
