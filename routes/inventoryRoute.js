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
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

//CRUD operations routes

router.get(
  "/classification",
  utilities.checkAdminGuard,
  invController.buildAddClassification
);
router.post(
  "/classification",
  utilities.checkAdminGuard,
  invRules.classificationRules(),
  invRules.checkClassificationData,
  invController.addClassification
);

router.get(
  "/inventory",
  utilities.checkAdminGuard,
  invController.buildAddInventory
);

router.post(
  "/inventory",
  utilities.checkAdminGuard,
  invRules.inventoryRules(),
  invRules.checkInventoryData,
  invController.addVehicle
);

router.get(
  "/edit/:inventory_id",
  utilities.checkAdminGuard,
  invController.buildEditInventory
);
router.post(
  "/update/",
  utilities.checkAdminGuard,
  invRules.inventoryRules(),
  invRules.checkUpdateData,
  invController.updateInventory
);

// Delete inventory item
router.get(
  "/delete/:inventory_id",
  utilities.checkAdminGuard,
  invController.buildConfirmDelete
);
router.post(
  "/delete/:inventory_id",
  utilities.checkAdminGuard,
  invRules.inventoryRules(),
  invRules.checkUpdateData,
  invController.deleteInventory
);

module.exports = router;
