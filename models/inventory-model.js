const pool = require("../database");

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
 * @description Get inventory ordered by key
 * @param {*} inventory_id
 * @param {*} key
 */
async function getInventoryOrdered(inventory_id, key) {
  const orderedCases = {
    name: "inv_make",
    price: "inv_price",
    year: "inv_year",
  };
  const dbTable = orderedCases[key];

  const sql = `SELECT * FROM public.inventory AS i 
  JOIN public.classification AS c 
  ON i.classification_id = c.classification_id 
  WHERE i.classification_id = $1 ORDER BY $2 DESC`;
  const data = await pool.query(sql, [inventory_id, dbTable]);
  return data.rows;
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

async function addClassification(classification_name) {
  const query =
    "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
  return await pool.query(query, [classification_name]);
}

async function addVehicle(vehicle) {
  console.log("🚀 ~ addVehicle ~ vehicle:", vehicle);

  const query =
    "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_miles, inv_price, inv_color, inv_description, inv_image, inv_thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
  return await pool.query(query, [
    vehicle.classification_id,
    vehicle.inv_make,
    vehicle.inv_model,
    vehicle.inv_year,
    vehicle.inv_miles,
    vehicle.inv_price,
    vehicle.inv_color,
    vehicle.inv_description,
    vehicle.inv_image,
    vehicle.inv_thumbnail,
  ]);
}

async function updateVehicle(vehicle) {
  console.log("🚀 ~ updateVehicle ~ vehicle:", vehicle);
  const query = `UPDATE inventory SET classification_id = $1, inv_make = $2,
  inv_model = $3,
  inv_year = $4,
  inv_miles = $5,
  inv_price = $6,
  inv_color = $7,
  inv_description = $8,
  inv_image = $9,
  inv_thumbnail = $10
  WHERE inv_id = $11 RETURNING *`;
  const data = await pool.query(query, [
    vehicle.classification_id,
    vehicle.inv_make,
    vehicle.inv_model,
    vehicle.inv_year,
    vehicle.inv_miles,
    vehicle.inv_price,
    vehicle.inv_color,
    vehicle.inv_description,
    vehicle.inv_image,
    vehicle.inv_thumbnail,
    vehicle.inv_id,
  ]);
  return data.rows[0];
}

async function deleteVehicle(inventory_id) {
  const query = "DELETE FROM inventory WHERE inv_id = $1";
  try {
    const data = await pool.query(query, [inventory_id]);
    return data;
  } catch (error) {
    new Error("Delete Inventory Error");
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryOrdered,
  getCarById,
  addClassification,
  addVehicle,
  updateVehicle,
  deleteVehicle,
};
