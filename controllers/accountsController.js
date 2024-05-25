const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    errors: null,
  });
};

accountController.buildRegister = async function (req, res) {
  let nav = await utilities.getNav();
  let passwordRules = utilities.buildPasswordRules();
  res.render("account/register", {
    title: "Register",
    nav,
    passwordRules,
    errors: null,
  });
};

/* ****************************************
 *  Process Registration
 * *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  let passwordRules = utilities.buildPasswordRules();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      passwordRules,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      passwordRules,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      passwordRules,
    });
  }
};

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  console.log("accountLogin controller called");
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    console.log("No account data in the db");
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 }); //http only
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true, // only send cookie over https
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
};

accountController.buildLoggedApp = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("account/logged", {
    title: "Logged",
    nav,
    errors: null,
  });
};

accountController.buildUpdate = async function (req, res) {
  const { account_id } = req.params;

  let nav = await utilities.getNav();
  const passwordRules = utilities.buildPasswordRules();

  // get user information by id to populate the update vie
  const userData = await accountModel.getAccountById(account_id);
  const { account_firstname, account_lastname, account_email } = userData;
  res.render(`account/update`, {
    title: "Update",
    nav,
    errors: null,
    passwordRules,
    account_firstname,
    account_lastname,
    account_email,
  });
};

accountController.updateInformationAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const passwordRules = utilities.buildPasswordRules();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  const accountData = {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  };
  console.log("user updated information");
  console.table(accountData);
  try {
    const updateResult = await accountModel.updateAccount(accountData);
    console.log("updateResult", updateResult);
    if (updateResult) {
      req.flash("notice", "Information updated successfully.");
      res.redirect("/");
    } else {
      req.flash("notice", "Sorry, the update process failed.");
      res.status(501).render("account/update", {
        title: "Update",
        nav,
        passwordRules,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    console.error(error);
    new Error(error);
  }
};

module.exports = accountController;
