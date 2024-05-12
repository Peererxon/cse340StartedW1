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

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/**
 * Retrieves a car from the inventory by its ID.
 * @param {number} inventory_id - The ID of the car in the inventory.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of car objects.
 */
async function getCarById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory as i WHERE i.inv_id = $1`,
      [inventory_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getCarById error " + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getCarById,
};
