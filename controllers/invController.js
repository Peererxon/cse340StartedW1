const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildByCarId = async function (req, res, next) {
  const cardId = req.params.carId;
  const data = await invModel.getCarById(cardId);
  let nav = await utilities.getNav();
  const view = await utilities.buildCarDetailGrid(data);
  const title = `${data[0].inv_make} ${data[0].inv_model} details`;
  res.render("./inventory/carDetail", {
    nav,
    detail: view,
    title,
  });
};

module.exports = invCont;
