const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountsController");
const regValidate = require("../utilities/account-validation");
const Util = require("../utilities");

//Routes
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountController.registerAccount)
);
module.exports = router;
