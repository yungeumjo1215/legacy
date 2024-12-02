const fs = require("fs");

exports.getEvents = (req, res) => {
  try {
    // Read and parse JSON file
    const data = JSON.parse(
      fs.readFileSync("../data/kyunggifestival.json", "utf8")
    );

    // Extract TITLE and IMAGE_URL
    const events = data.map((event) => ({
      title: event.TITLE,
      imageUrl: event.IMAGE_URL,
    }));

    // Send response
    res.status(200).json(events);
  } catch (error) {
    console.error("Error reading or parsing the file:", error);
    res.status(500).send("Internal Server Error");
  }
};
