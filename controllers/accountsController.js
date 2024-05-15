const utilities = require("../utilities/");

const accountController = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
accountController.buildLogin = async function (req, res) {
  let nav = await utilities.getNav();
  let passwordRules = utilities.buildPasswordRules();
  res.render("account/login", {
    title: "Login",
    nav,
    passwordRules,
  });
};

accountController.buildRegister = async function (req, res) {
  let nav = await utilities.getNav();
  let passwordRules = utilities.buildPasswordRules();
  res.render("account/register", {
    title: "Register",
    nav,
    passwordRules,
  });
};
module.exports = accountController;
