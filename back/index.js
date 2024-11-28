const express = require("express");
const cors = require("cors");
const heritageRoutes = require("./routes/heritageRoutes");
const festivalRoutes = require("./routes/festivalRoutes");

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("node depoly Test");
});

// Heritage and Festival Routes
app.use("/heritage", heritageRoutes);
app.use("/festival", festivalRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
