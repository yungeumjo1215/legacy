const pool = require("../database/database");

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

function insertFavoriteFestivals(pool, token, favoriteFestivals) {
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

function insertFavoriteHeritages(pool, token, favoriteHeritages) {
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
