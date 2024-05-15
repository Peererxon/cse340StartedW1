const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountsController");
//Routes
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
module.exports = router;
