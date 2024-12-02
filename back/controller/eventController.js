const fs = require("fs");
const path = require("path"); // path 경로지정 모듈 많으면 무조건 사용할것

exports.getEvents = (req, res) => {
  try {
    // Resolve the path to the JSON file
    const filePath = path.resolve(__dirname, "../data/kyunggifestival.json");

    // Read and parse JSON file
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Extract TITLE and IMAGE_URL
    const events = data.map((event) => ({
      title: event.TITLE,
      imageUrl: event.IMAGE_URL,
    }));

    // Send response
    res.status(200).json(events);
  } catch (error) {
    console.error("Error reading or parsing the file:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
