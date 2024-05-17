const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const baseController = require("../controllers/baseController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:carId", invController.buildByCarId);
router.get("errors/error/:errorStatus", baseController.buildError);

// Route to build admin view
router.get("", invController.buildAdminView);
router.get("/classification", invController.buildAddClassification);
module.exports = router;
