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

// // Insert favorite festivals
// async function insertFavoriteFestivals(pool, token, favoriteFestivals) {
//   for (const festival of favoriteFestivals) {
//     const {
//       programName,
//       programContent,
//       location,
//       startDate,
//       endDate,
//       contact,
//       targetAudience,
//       imageUrl,
//     } = festival;

//     await pool.query(
//       `INSERT INTO favoritelist
//       (token, programName, programContent, location, startDate, endDate, targetAudience, contact, imageUrl, ccbamnm1, ccbalcad, content, ccce_name)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NULL, NULL, NULL, NULL)`,
//       [
//         token,
//         programName,
//         programContent,
//         location,
//         startDate,
//         endDate,
//         targetAudience,
//         contact,
//         imageUrl,
//       ]
//     );
//   }
// }

// // Insert favorite heritages
// async function insertFavoriteHeritages(pool, token, favoriteHeritages) {
//   for (const heritage of favoriteHeritages) {
//     const { ccbamnm1, ccbalcad, content, imageurl, ccce_name } = heritage;

//     await pool.query(
//       `INSERT INTO favoritelist
//       (token, programName, programContent, location, startDate, endDate, targetAudience, contact, imageUrl, ccbamnm1, ccbalcad, content, ccce_name)
//       VALUES ($1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, $2, $3, $4, $5, $6)`,
//       [token, imageurl, ccbamnm1, ccbalcad, content, ccce_name]
//     );
//   }
// }
function insertFavoriteFestivals(pool, token, favoriteFestivals) {
  const promises = favoriteFestivals.map((festival) => {
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
  });

  return Promise.all(promises);
}

function insertFavoriteHeritages(pool, token, favoriteHeritages) {
  const promises = favoriteHeritages.map((heritage) => {
    const { ccbamnm1, ccbalcad, content, imageurl, ccce_name } = heritage;

    return pool.query(
      `INSERT INTO favoritelist
      (token, ccbamnm1, ccbalcad, content, imageUrl, ccce_name)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [token, ccbamnm1, ccbalcad, content, imageurl, ccce_name]
    );
  });

  return Promise.all(promises);
}
module.exports = {
  executeTransaction,
  insertFavoriteFestivals,
  insertFavoriteHeritages,
};
