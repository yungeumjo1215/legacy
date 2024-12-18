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

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Server is running");
});

// 챗봇 라우트
app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;

    // Python 스크립트 실행
    const pythonProcess = spawn("python", ["chatbot/chatbot.py", question]);

    let answer = "";

    pythonProcess.stdout.on("data", (data) => {
      answer += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python 에러: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return res
          .status(500)
          .json({ error: "챗봇 처리 중 오류가 발생했습니다." });
      }
      res.json({ answer: answer.trim() });
    });
  } catch (error) {
    console.error("서버 에러:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// API 라우트
// app.use("/festival", festivalRoutes);
app.use("/api/pgdb", pgdbRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/account", accountRoutes);
app.use("/pgdb", pgdbRoutes);
app.use("/event", eventRoutes);
app.use("/account", accountRoutes);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "서버 오류가 발생했습니다." });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
