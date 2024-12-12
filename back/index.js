const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const {
  executeTransaction,
  insertFavoriteFestivals,
  insertFavoriteHeritages,
} = require("./controller/favoriteController");
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

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Server is running");
});

// 챗봇 라우트
app.post("/chat", async (request, response) => {
  try {
    const { question } = request.body;
    console.log("받은 질문:", question);

    if (!question) {
      return response.status(400).json({
        message: "메시지가 없습니다.",
      });
    }

    // 파이썬 실행 경로 로깅 추가
    const pythonPath = path.join(__dirname, "chatbot", "chatbot.py");
    // console.log("파이썬 스크립트 경로:", pythonPath);

    const pythonProcess = spawn("python", [pythonPath, question]);

    let answer = "";
    let errorOutput = "";
    let hasResponded = false;

    pythonProcess.stdout.on("data", (data) => {
      // console.log("파이썬 출력:", data.toString());
      answer += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      const errorMsg = data.toString();
      console.error("파이썬 에러 출력:", errorMsg);
      errorOutput += errorMsg;

      if (!errorMsg.includes("USER_AGENT") && !hasResponded) {
        hasResponded = true;
        // clearTimeout(timeout);
        response.status(500).json({
          message: "챗봇 처리 중 오류가 발생했습니다.",
          error: errorOutput,
        });
      }
    });

    pythonProcess.on("close", (code) => {
      // clearTimeout(timeout);
      if (!hasResponded) {
        hasResponded = true;
        if (code === 0 && answer.trim()) {
          response.status(200).json({
            message: answer.trim(),
          });
        } else {
          console.error(`Python 프로세스 종료 상세정보:
            코드: ${code}
            응답: ${answer}
            에러: ${errorOutput}`);

          response.status(500).json({
            message: "챗봇 응답 생성 실패",
            details: `종료 코드: ${code}, 에러: ${errorOutput}`,
          });
        }
      }
    });

    // 에러 이벤트 처리
    pythonProcess.on("error", (error) => {
      // clearTimeout(timeout);
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

app.get("/api/show-favorites", (req, res) => {
  res.status(200).json(storedFavorites);
  // console.log("Received favorite festivals:", storedFavorites);
});

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

app.post("/api/store-favoritesPGDB", (req, res) => {
  const { favoriteFestivals, favoriteHeritages } = req.body;
  const token = req.headers.token;

  if (!token) {
    return res.status(400).json({ message: "Token is required." });
  }

  if (!favoriteFestivals.length && !favoriteHeritages.length) {
    return res.status(400).json({ message: "No data to process." });
  }

  executeTransaction((pool) => {
    const promises = [];

    if (favoriteFestivals.length > 0) {
      promises.push(insertFavoriteFestivals(pool, token, favoriteFestivals));
    }

    if (favoriteHeritages.length > 0) {
      promises.push(insertFavoriteHeritages(pool, token, favoriteHeritages));
    }

    return Promise.all(promises);
  })
    .then(() =>
      res
        .status(200)
        .json({ message: "Data successfully stored in PostgreSQL." })
    )
    .catch((error) => {
      console.error("Error processing data:", error.message);
      res.status(500).json({
        message: "Error storing data in PostgreSQL.",
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
