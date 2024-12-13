const pool = require("../database/database");
const jwt = require("jsonwebtoken"); // Use jwt for decoding
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

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

// Decode and verify the token
function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded || !decoded.email) {
      throw new Error("Email not found in token payload.");
    }
    return decoded.email; // Return email from the decoded token
  } catch (err) {
    console.error("Token decoding error:", err.message);
    throw err; // Re-throw to indicate token is invalid
  }
}

// Insert favorite festivals
async function insertFavoriteFestivals(pool, token, favoriteFestivals) {
  const email = decodeToken(token);

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

    const existingRecord = await pool.query(
      `SELECT id FROM favoritelist WHERE "token" = $1 AND "programName" = $2 AND "location" = $3`,
      [email, programName, location]
    );

    if (existingRecord.rowCount === 0) {
      return pool.query(
        `INSERT INTO favoritelist
        ("token", "programName", "programContent", "location", "startDate", "endDate", "targetAudience", "contact", "imageUrl")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          email,
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

// Insert favorite heritages
async function insertFavoriteHeritages(pool, token, favoriteHeritages) {
  const email = decodeToken(token);

  const promises = favoriteHeritages.map(async (heritage) => {
    const { ccbamnm1, ccbalcad, content, imageurl, ccce_name } = heritage;

    const existingRecord = await pool.query(
      `SELECT id FROM favoritelist WHERE "token" = $1 AND "ccbamnm1" = $2 AND "ccbalcad" = $3`,
      [email, ccbamnm1, ccbalcad]
    );

    if (existingRecord.rowCount === 0) {
      return pool.query(
        `INSERT INTO favoritelist
        ("token", "ccbamnm1", "ccbalcad", "content", "imageUrl", "ccce_name")
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [email, ccbamnm1, ccbalcad, content, imageurl, ccce_name]
      );
    } else {
      console.log(`Duplicate heritage found: ${ccbamnm1}, skipping insert.`);
    }
  });

  return Promise.all(promises);
}

// Delete favorite festivals
async function deleteFavoriteFestivals(pool, token, festivalsToDelete) {
  const email = decodeToken(token);

  const promises = festivalsToDelete.map(async (festival) => {
    const { programName, location } = festival;

    console.log(`Deleting festival: ${programName}, Location: ${location}`); // Log the item being deleted

    return pool.query(
      `DELETE FROM favoritelist 
       WHERE "token" = $1 AND "programName" = $2 AND "location" = $3`,
      [email, programName, location]
    );
  });

  return Promise.all(promises);
}

// Delete favorite heritages
async function deleteFavoriteHeritages(pool, token, heritagesToDelete) {
  const email = decodeToken(token);

  const promises = heritagesToDelete.map(async (heritage) => {
    const { ccbamnm1, ccbalcad } = heritage;

    console.log(`Deleting heritage: ${ccbamnm1}, Address: ${ccbalcad}`); // Log the item being deleted

    return pool.query(
      `DELETE FROM favoritelist 
       WHERE "token" = $1 AND "ccbamnm1" = $2 AND "ccbalcad" = $3`,
      [email, ccbamnm1, ccbalcad]
    );
  });

  return Promise.all(promises);
}

module.exports = {
  executeTransaction,
  insertFavoriteFestivals,
  insertFavoriteHeritages,
  deleteFavoriteFestivals,
  deleteFavoriteHeritages,
};
