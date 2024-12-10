const axios = require("axios");
const { parseStringPromise } = require("xml2js");
const { heritageInfo_Url } = require("../utils/apiUtils");

/**
 * Cleans text by removing newlines, tabs, and extra whitespace.
 * @param {string} text - The text to clean.
 * @returns {string} - Cleaned text.
 */
const cleanText = (text) => text?.replace(/\r\n|\n|\r|\t/g, "").trim() || "-";

/**
 * Fetches the heritage list and enriches with details.
 * @param {number} limit - Maximum number of heritage items to fetch.
 * @returns {Array<object>} - List of enriched heritage data.
 */
const fetchHeritageList = async (limit = 10) => {
  const heritageList = [];
  let totalFetched = 0;

  for (let pageIndex = 1; pageIndex < 100; pageIndex++) {
    try {
      const url = `https://www.cha.go.kr/cha/SearchKindOpenapiList.do?pageUnit=100&pageIndex=${pageIndex}`;
      const response = await axios.get(url, {
        headers: { Accept: "application/xml" },
      });

      const xmlText = response.data;
      const jsonData = await parseStringPromise(xmlText);
      const items = jsonData.result?.item || [];

      for (const item of items) {
        const heritage = {
          ccbakdcd: item.ccbakdcd?.[0],
          ccbaasno: item.ccbaasno?.[0],
          ccbactcd: item.ccbactcd?.[0],
          ccbamnm1: item.ccbamnm1?.[0],
        };

        const detailResponse = await axios.get(
          heritageInfo_Url(
            heritage.ccbakdcd,
            heritage.ccbaasno,
            heritage.ccbactcd
          ),
          { headers: { Accept: "application/xml" } }
        );

        const detailXmlText = detailResponse.data;
        const detailJsonData = await parseStringPromise(detailXmlText);
        const detailItem = detailJsonData.result?.item?.[0] || {};

        heritage.ccbalcad = cleanText(detailItem.ccbalcad?.[0] || "-");
        heritage.cccename = cleanText(detailItem.cccename?.[0] || "-");
        heritage.content = detailItem.content?.[0] || "-";
        heritage.imageurl = detailItem.imageurl?.[0] || "-";

        heritageList.push(heritage);
        totalFetched++;

        if (totalFetched >= limit) return heritageList;
      }
    } catch (error) {
      console.error(`Error fetching heritage data:`, error.message);
    }
  }

  return heritageList;
};

/**
 * Heritage List API Handler
 */
const getHeritageList = async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await fetchHeritageList(limit ? parseInt(limit) : 100); // 문화재 갯수 조절
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getHeritageList };
