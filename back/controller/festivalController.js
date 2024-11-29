const axios = require("axios");
const { parseStringPromise } = require("xml2js");
const { festivalInfo_Url } = require("../utils/apiUtils");

/**
 * Fetches and processes festival data.
 * @param {string} year - The year to search for festivals.
 * @param {string} month - The month to search for festivals.
 * @returns {Array<object>} - Processed festival data.
 */
const fetchFestivalData = async (year, month) => {
  try {
    const response = await axios.get(festivalInfo_Url(year, month), {
      headers: { Accept: "application/xml" },
    });
    console.log("API Response:", response.data); // 응답 데이터 로그 출력

    const xmlText = response.data;
    console.log("Raw XML Data:", xmlText);
    const jsonData = await parseStringPromise(xmlText);
    const items = jsonData.result?.item || [];

    return items.map((item) => ({
      programName: item.subTitle || "N/A",
      programContent: item.subContent || "N/A",
      startDate: item.sDate || "N/A",
      endDate: item.eDate || "N/A",
      location: item.subDesc || "N/A",
      contact: item.contact || "N/A",
      image: item.fileNm || "N/A",
      targetAudience: item.subDesc1 || "N/A",
      additionalInfo: `${item.subDesc2 || "N/A"}, ${item.subDesc_3 || "N/A"}`,
    }));
  } catch (error) {
    console.error("Error in fetchFestivalData:", error);
    throw new Error("Failed to fetch festival data.");
  }
};

/**
 * Festival List API Handler
 */
const getFestivalList = async (req, res) => {
  try {
    // Use default values if query parameters are missing
    const year = req.query.year || new Date().getFullYear(); // Current year
    const month = req.query.month || 11; // Default to November (11)

    const data = await fetchFestivalData(year, month)();
    res.status(200).json({
      year,
      month,
      data,
    });
  } catch (error) {
    console.error("Festival fetch error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getFestivalList };
