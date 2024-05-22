const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const baseController = require("../controllers/baseController");
const utilities = require("../utilities");
const invRules = require("../utilities/inv-validations");
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:carId", invController.buildByCarId);
router.get("errors/error/:errorStatus", baseController.buildError);

// Route to build admin view
router.get("", invController.buildManagementView);
router.get("/classification", invController.buildAddClassification);
router.post(
  "/classification",
  invRules.classificationRules(),
  invRules.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.get("/inventory", invController.buildAddInventory);

router.post(
  "/inventory",
  invRules.inventoryRules(),
  invRules.checkInventoryData,
  utilities.handleErrors(invController.addVehicle)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

//CRUD operations routes
router.get("/edit/:inventory_id", invController.buildEditInventory);
router.post(
  "/update/",
  invRules.inventoryRules(),
  invRules.checkUpdateData,
  invController.updateInventory
);

module.exports = router;
