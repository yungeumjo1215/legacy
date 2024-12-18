const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
  executeTransaction,
  insertFavoriteFestivals,
  insertFavoriteHeritages,
  deleteFavoriteFestivals,
  deleteFavoriteHeritages,
} = require("./controller/favoriteController");
const path = require("path");
const spawn = require("child_process").spawn;

// 라우트 임포트
const accountRoutes = require("./routes/accountRoutes");
const pgdbRoutes = require("./routes/postgreSQLRoutes");
const eventRoutes = require("./routes/eventRoutes");
// const festivalRoutes = require("./routes/kgfestivalRoutes");

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
    console.log("받은 질문:", question); // 디버깅용

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
app.use("/pgdb", pgdbRoutes);
app.use("/event", eventRoutes);
app.use("/account", accountRoutes);

app.post("/api/store-favoritesPGDB", (req, res) => {
  const {
    favoriteFestivals,
    favoriteHeritages,
    festivalsToDelete,
    heritagesToDelete,
  } = req.body;
  const token = req.headers.token;

  // Log incoming request for debugging
  console.log("Received token:", token);
  console.log("Received body:", req.body);

  // Validate token
  if (!token) {
    return res.status(400).json({ message: "Token is required." });
  }

  // Validate body structure
  if (!Array.isArray(favoriteFestivals) || !Array.isArray(favoriteHeritages)) {
    return res
      .status(400)
      .json({ message: "Invalid data format for favorites." });
  }

  if (!Array.isArray(festivalsToDelete) || !Array.isArray(heritagesToDelete)) {
    return res
      .status(400)
      .json({ message: "Invalid data format for deletions." });
  }

  executeTransaction(async (pool) => {
    const promises = [];

    // Handle additions
    if (favoriteFestivals.length > 0) {
      console.log("Adding favorite festivals:", favoriteFestivals);
      promises.push(insertFavoriteFestivals(pool, token, favoriteFestivals));
    }

    if (favoriteHeritages.length > 0) {
      console.log("Adding favorite heritages:", favoriteHeritages);
      promises.push(insertFavoriteHeritages(pool, token, favoriteHeritages));
    }

    // Handle deletions
    if (festivalsToDelete.length > 0) {
      console.log("Deleting festivals:", festivalsToDelete);
      promises.push(deleteFavoriteFestivals(pool, token, festivalsToDelete));
    }

    if (heritagesToDelete.length > 0) {
      console.log("Deleting heritages:", heritagesToDelete);
      promises.push(deleteFavoriteHeritages(pool, token, heritagesToDelete));
    }

    await Promise.all(promises);
  })
    .then(() =>
      res.status(200).json({
        message: "Data successfully stored and updated in PostgreSQL.",
      })
    )
    .catch((error) => {
      console.error("Error processing data:", error.message);
      res.status(500).json({
        message: "Error storing or updating data in PostgreSQL.",
        error: error.message,
      });
    });
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
