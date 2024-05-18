const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const baseController = require("../controllers/baseController");
const Util = require("../utilities");
const invRules = require("../utilities/inv-validations");
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:carId", invController.buildByCarId);
router.get("errors/error/:errorStatus", baseController.buildError);

// Route to build admin view
router.get("", invController.buildAdminView);
router.get("/classification", invController.buildAddClassification);
router.post(
  "/classification",
  invRules.classificationRules(),
  invRules.checkClassificationData,
  Util.handleErrors(invController.addClassification)
);

router.get("/inventory", invController.buildAddInventory);

router.post(
  "/inventory",
  invRules.inventoryRules(),
  invRules.checkInventoryData,
  Util.handleErrors(invController.addVehicle)
);
module.exports = router;
