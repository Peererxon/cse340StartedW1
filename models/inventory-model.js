const pool = require("../database/");

/**
 * Retrieves all classifications from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of classification objects.
 */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

module.exports = {
  getClassifications,
};
