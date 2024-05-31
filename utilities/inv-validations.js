const utilities = require(".");
const { body, validationResult, query } = require("express-validator");
const validate = {};

validate.classificationRules = () => {
  return [
    // name validation
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .matches("^[a-zA-Z]*$")
      .withMessage("Please provide a name, only letters allowed"),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name,
    });
    return;
  }
  next();
};

validate.inventoryRules = () => {
  return [
    // make validation
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a company"),
    // model validation
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .matches("^[a-zA-Z]*$")
      .withMessage("Please provide a model, only letters allowed"),
    // year validation
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a valid year"),
    //miles validation
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide a valid mileage"),
    // price validation
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide a valid price"),
    // color validation
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .matches("^[a-zA-Z]*$")
      .withMessage("Please provide a color, only letters allowed"),
    // classification validation
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide a valid classification"),
    // thumbnail validation
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid image URL"),
    //image validation
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid image URL"),
  ];
};

/**
 * @description Validates the add data
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next function from express
 * @returns {void}
 */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_miles,
    inv_price,
    inv_color,
    inv_description,
    classification_id,
    inv_thumbnail,
    inv_image,
  } = req.body;
  let errors = validationResult(req);
  console.log(inv_image);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_color,
      inv_miles,
      inv_description,
      classification_id,
      inv_thumbnail,
      inv_image,
      classificationList,
    });
    return;
  }
  next();
};

/**
 * @description Validates the update data
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next function from express
 * @returns {void}
 */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_miles,
    inv_price,
    inv_color,
    inv_description,
    classification_id,
    inv_thumbnail,
    inv_image,
    inv_id,
  } = req.body;
  let errors = validationResult(req);
  console.log(inv_image);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("./inventory/edit-inventory", {
      title: "Edit Inventory",
      nav,
      errors,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_color,
      inv_miles,
      inv_description,
      classification_id,
      inv_thumbnail,
      inv_image,
      classificationList,
    });
    return;
  }
  next();
};

validate.orderByQueryRules = () => {
  return [
    query("orderBy", "wrong filter in order by")
      .escape()
      .matches("^[a-z]*$")
      .optional(),
  ];
};

validate.checkOrderBy = async (req, res, next) => {
  try {
    const classification_id = req.params.classificationId;
    //const data = await inv.getInventoryByClassificationId(classification_id);
    //const grid = await utilities.buildClassificationGrid(data);
    const grid = `<div></div>`;
    const errors = validationResult(req);
    console.log(JSON.stringify(errors));
    //const className = data[0].classification_name;
    const nav = await utilities.getNav();
    if (!errors.isEmpty()) {
      res.render("./inventory/classification", {
        title: "Wrong search",
        nav,
        grid,
        errors,
      });
      return;
    }
    console.log("ejecutando flujo normal, sin errorers");
    next();
  } catch (error) {
    console.log(error + " in the orderByValidations");
    next();
  }
};

module.exports = validate;
