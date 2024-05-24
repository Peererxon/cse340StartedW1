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
    errors: null,
  });
};

/* ***************************
 *  Build inventory by car detail view
 * ************************** */
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
    errors: null,
  });
};

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/admin-functions", {
    title: "Admin Inventory",
    nav,
    errors: null,
    classificationList,
  });
};

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();

  const { classification_name } = req.body;
  try {
    const classResult = invModel.addClassification(classification_name);
    if (classResult) {
      req.flash(
        "notice",
        `Classification ${classification_name} added successfully.`
      );
      res.status(201).render("./inventory/admin-functions", {
        title: "Admin Inventory",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    req.flash("notice", `Error adding classification ${classification_name}.`);
    res.status(500).render("./inventory/admin-functions", {
      title: "Admin Inventory",
      nav,
      errors: null,
    });
  }
};

invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classificationList,
  });
};

invCont.addVehicle = async function (req, res) {
  const nav = await utilities.getNav();
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
  const vehicleData = {
    inv_make,
    inv_model,
    inv_year,
    inv_miles,
    inv_price,
    inv_color,
    classification_id,
    inv_thumbnail,
    inv_image,
    inv_description,
  };
  vehicleData.inv_image = "/images/vehicles/no-image.png";
  vehicleData.inv_thumbnail = "/images/vehicles/no-image-tn.png";
  try {
    const addResult = await invModel.addVehicle(vehicleData);
    if (addResult) {
      req.flash(
        "notice",
        `Vehicle ${inv_make} ${inv_model} added successfully.`
      );
      res.status(201).render("./inventory/admin-functions", {
        title: "Admin Inventory",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error(error);
    req.flash("notice", `Error adding vehicle ${inv_make} ${inv_model}.`);
    res.status(500).render("./inventory/admin-functions", {
      title: "Admin Inventory",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

invCont.buildEditInventory = async function (req, res) {
  const inv_id = parseInt(req.params.inventory_id);
  let nav = await utilities.getNav();
  const [itemData] = await invModel.getCarById(inv_id);
  console.log("🚀 ~ itemData:", itemData);
  const classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */

invCont.updateInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const {
    inv_id,
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

  const vehicleUpdated = {
    inv_id,
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
  };
  const itemName = `${inv_make} ${inv_model}`;
  try {
    const updateResult = await invModel.updateVehicle(vehicleUpdated);
    if (updateResult) {
      req.flash("notice", `Vehicle ${itemName} updated successfully.`);

      res.redirect("/inv/");
    }
  } catch (error) {
    console.error(error);
    const classificationList = await utilities.buildClassificationList(
      itemData.classification_id
    );
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("./inventory/edit-inventory", {
      title: `Edit ${itemName}`,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classificationList,
    });
  }
};

//Delivering the delete confirmation page
invCont.buildConfirmDelete = async function (req, res) {
  const inv_id = parseInt(req.params.inventory_id);
  let nav = await utilities.getNav();
  const [itemData] = await invModel.getCarById(inv_id);
  console.log("🚀 ~ itemData:", itemData);
  const classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Deleting " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

invCont.deleteInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const {
    inv_id,
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

  const vehicleUpdated = {
    inv_id,
  };
  const itemName = `${inv_make} ${inv_model}`;
  try {
    const deleteResult = await invModel.deleteVehicle(vehicleUpdated);
    if (deleteResult) {
      req.flash("notice", `Vehicle ${itemName} deleted successfully.`);

      res.redirect("/inv/");
    }
  } catch (error) {
    console.error(error);
    const classificationList = await utilities.buildClassificationList(
      itemData.classification_id
    );
    req.flash("notice", "Sorry, the delete process failed.");
    res.status(501).render("./inventory/delete-confirm", {
      title: `Edit ${itemName}`,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classificationList,
    });
  }
};

module.exports = invCont;
