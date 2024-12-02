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
      image: item.fileNm || "N/A",
      targetAudience: item.subDesc1 || "N/A",
      additionalInfo: `${item.subDesc2 || "N/A"}, ${item.subDesc_3 || "N/A"}`,
    }));

    // Slice the transformed data to only include the first item
    return transformedItems.slice(0, 1);
  } catch (error) {
    console.error("Error in fetchFestivalData:", error.message);
    throw new Error(`Failed to fetch festival data for ${year}-${month}`);
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

    const allData = await fetchFestivalData(year, month);

<<<<<<< HEAD
    const data = allData.slice(0);
=======
    data = allData.slice(0, 1);
    // const data = allData; //위 코드 때문에 홍보행사 데이터가 안 들어와서 주석으로 추가 해놨습니다.
>>>>>>> a009c58d8f6f5ffd0e3dbef26362534d6e0f16f1

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
