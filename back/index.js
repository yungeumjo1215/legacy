const express = require("express");
const cors = require("cors");

const heritageRoutes = require("./routes/heritageRoutes");
const festivalRoutes = require("./routes/festivalRoutes");
const pgdbRoutes = require("./routes/postgreSQLRoutes");

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
app.use("/pgdb", pgdbRoutes);

// Task related thingy
// app.use(require("./routes/getRoutes"));
// app.use(require("./routes/deleteRoutes"));
// app.use(require("./routes/postRoutes"));
// app.use(require("./routes/updateRoutes"));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
