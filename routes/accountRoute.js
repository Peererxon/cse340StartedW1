const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountsController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities");

//Routes
router.get(
  "",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildLoggedApp)
);

//update account information
router.post(
  "/update",
  regValidate.updateInformationRules(),
  regValidate.checkUpdateInformation,
  utilities.handleErrors(accountController.updateInformationAccount)
);

router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdate)
);

router.get("/login", accountController.buildLogin);
//Process the login attemp
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get("/register", accountController.buildRegister);
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
module.exports = router;
