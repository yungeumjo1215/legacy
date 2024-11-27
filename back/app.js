const express = require("express");
const cors = require("cors");
const heritageRoutes = require("./routes/heritageRoutes");
const festivalRoutes = require("./routes/festivalRoutes");

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

// Base Routes
app.get("/", (req, res) => res.send("<h1>Welcome to the API Server</h1>"));

// Heritage and Festival Routes
app.use("/heritage", heritageRoutes);
app.use("/festival", festivalRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
