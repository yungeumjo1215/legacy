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
      URL: event.URL,
      begin_de: event.BEGIN_DE,
      end_de: event.END_DE,

      event_tm_info: event.EVENT_TM_INFO,
      host_inst_nm: event.HOST_INST_NM,
      event_sido: event.EVENT_SIDO,
    }));

    const limitedEvents = events.slice(0, 10);
    // Send response
    res.status(200).json(limitedEvents);
  } catch (error) {
    console.error("Error reading or parsing the file:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.getKGfestival = (req, res) => {
  try {
    // Resolve the path to the JSON file
    const filePath = path.resolve(__dirname, "../data/festival.json");

    // Read and parse JSON file
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Extract TITLE and IMAGE_URL
    const festival = data.map((item) => ({
      programName: [item.subTitle] || "N/A",
      programContent: [item.subContent] || "N/A",
      startDate: [item.sDate] || "N/A",
      endDate: [item.eDate] || "N/A",
      location: [item.subDesc] || "N/A",
      contact: [item.contact] || "N/A",
      sido: [item.sido] || "N/A",
      targetAudience: [item.subDesc2] || "N/A",
      imageUrl: [item.imageUrl] || "N/A",
    }));

    const limitedFestivals = festival.slice(0, 100000);
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();
    const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;

    // Send the structured response
    res.status(200).json({
      year,
      month,
      data: limitedFestivals,
    });
  } catch (error) {
    console.error("Error reading or parsing the file:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
