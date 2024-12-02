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
    // Call the API with the specified year and month
    const response = await axios.get(festivalInfo_Url(year, month), {
      headers: { Accept: "application/xml" },
    });

    // Parse the XML response
    const xmlText = response.data;
    const jsonData = await parseStringPromise(xmlText);
    const items = jsonData.result?.item || [];

    if (!items.length) {
      console.warn(`No data found for ${year}-${month}`);
      return [];
    }

    // Transform the data into a more usable format
    const transformedItems = items.map((item) => ({
      programName: item.subTitle || "N/A",
      programContent: item.subContent || "N/A",
      startDate: item.sDate || "N/A",
      endDate: item.eDate || "N/A",
      location: item.subDesc || "N/A",
      contact: item.contact || "N/A",
      sido: item.sido || "N/A",
      targetAudience: item.subDesc_2 || "N/A",
    }));

    // Slice the transformed data to only include the first item
    return transformedItems.slice(0);
  } catch (error) {
    console.error("Error in fetchFestivalData:", error.message);
    throw new Error(`Failed to fetch festival data for ${year}-${month}`);
  }
};
// ------------------------------------------------------------ 위 슬라이스 위 에서 제한함
/**
 * Festival List API Handler
 */
const getFestivalList = async (req, res) => {
  try {
    // Use default values if query parameters are missing
    const year = req.query.year || new Date().getFullYear(); // Current year
    const month = req.query.month || new Date().getMonth(); // Default to November 제한품 (11)

    const data = await fetchFestivalData(year, month);
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
