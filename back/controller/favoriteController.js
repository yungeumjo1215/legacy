const pool = require("../database/database");
const jwt = require("jsonwebtoken");
// ,env 참조
const JWT_SECRET =
  "d0a8d3a91b13c84522b7745d84cde35d1e1a944bdb178d85bb2bd3f85f04f2497f3568c33a3dc5f8a1a78f7c4e8a9132";

// Function to parse and verify JWT
function parseJWT(token) {
  try {
    // Verify the token and decode its payload
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    throw new Error("Invalid or expired token");
  }
}
// Global transaction handler
async function executeTransaction(taskFn) {
  try {
    await pool.query("BEGIN"); // Start transaction
    await taskFn(pool); // Execute the task function, passing the pool
    await pool.query("COMMIT"); // Commit transaction
  } catch (error) {
    await pool.query("ROLLBACK"); // Rollback on error
    console.error("Transaction Error:", error.message);
    throw error; // Re-throw to propagate the error
  }
}

function insertFavoriteFestivals(pool, jwtToken, favoriteFestivals) {
  const user = parseJWT(jwtToken); // Parse the JWT to get user information
  const token = user.id || user.sub; // Use a relevant field from the token payload

  const promises = favoriteFestivals.map(async (festival) => {
    const {
      programName,
      programContent,
      location,
      startDate,
      endDate,
      targetAudience,
      contact,
      imageUrl,
    } = festival;

    // Check if the festival already exists
    const existingRecord = await pool.query(
      `SELECT id FROM favoritelist WHERE "token" = $1 AND "programName" = $2 AND "location" = $3`,
      [token, programName, location]
    );

    if (existingRecord.rowCount === 0) {
      // Insert only if the record doesn't exist
      return pool.query(
        `INSERT INTO favoritelist
        ("token", "programName", "programContent", "location", "startDate", "endDate", "targetAudience", "contact", "imageUrl")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          token,
          programName,
          programContent,
          location,
          startDate,
          endDate,
          targetAudience,
          contact,
          imageUrl,
        ]
      );
    } else {
      console.log(`Duplicate festival found: ${programName}, skipping insert.`);
    }
  });

  return Promise.all(promises);
}

function insertFavoriteHeritages(pool, jwtToken, favoriteHeritages) {
  const user = parseJWT(jwtToken); // Parse the JWT to get user information
  const token = user.id || user.sub; // Use a relevant field from the token payload

  const promises = favoriteHeritages.map(async (heritage) => {
    const { ccbamnm1, ccbalcad, content, imageurl, ccce_name } = heritage;

    // Check if the heritage already exists
    const existingRecord = await pool.query(
      `SELECT id FROM favoritelist WHERE "token" = $1 AND "ccbamnm1" = $2 AND "ccbalcad" = $3`,
      [token, ccbamnm1, ccbalcad]
    );

    if (existingRecord.rowCount === 0) {
      // Insert only if the record doesn't exist
      return pool.query(
        `INSERT INTO favoritelist
        ("token", "ccbamnm1", "ccbalcad", "content", "imageUrl", "ccce_name")
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [token, ccbamnm1, ccbalcad, content, imageurl, ccce_name]
      );
    } else {
      console.log(`Duplicate heritage found: ${ccbamnm1}, skipping insert.`);
    }
  });

  return Promise.all(promises);
}

module.exports = {
  executeTransaction,
  insertFavoriteFestivals,
  insertFavoriteHeritages,
};
