const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
const accountRoutes = require("./routes/accountRoutes");
const heritageRoutes = require("./routes/heritageRoutes");
const festivalRoutes = require("./routes/festivalRoutes");
const pgdbRoutes = require("./routes/postgreSQLRoutes");
const eventRoutes = require("./routes/eventRoutes");
const kgfestivalRoutes = require("./routes/kgfestivalRoutes");

const PORT = 8000;
const app = express();
app.use(bodyParser.json());

dotenv.config();

app.use(express.json());

let storedFavorites = {
  favoriteFestivals: [],
  favoriteHeritages: [],
};

app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 도메인
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("node depoly Test");
});

// Heritage and Festival Routes
app.use("/heritage", heritageRoutes);
app.use("/festival", festivalRoutes);
app.use("/pgdb", pgdbRoutes);
app.use("/event", eventRoutes);
app.use("/kgfestival", kgfestivalRoutes);

app.use("/account", accountRoutes);
app.post("/api/store-favorites", (req, res) => {
  const { favoriteFestivals, favoriteHeritages } = req.body;

  if (!favoriteFestivals && !favoriteHeritages) {
    return res
      .status(400)
      .json({ message: "No data received from the client." });
  }

  // Store the received data
  storedFavorites.favoriteFestivals = favoriteFestivals;
  storedFavorites.favoriteHeritages = favoriteHeritages;

  console.log("Received favorite festivals:", favoriteFestivals);
  console.log("Received favorite heritages:", favoriteHeritages);

  res.status(200).json({ message: "Data received successfully." });
});

// GET endpoint to fetch the stored data
app.get("/api/show-favorites", (req, res) => {
  res.status(200).json(storedFavorites);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
