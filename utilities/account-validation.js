const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model");

validate.registrationRules = () => {
  return [
    //first name validation
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide first name"),

    //last name validation
    body("account_lastname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Please provide a last name"),

    //email validation
    body("account_email")
      .trim()
      .escape()
      .normalizeEmail() //reference in validator.js
      .isEmail()
      .withMessage("Please provide a valid email address")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),
    //password validation
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements"),
  ];
};

validate.checkRegData = async (req, res, next) => {
  const passwordRules = utilities.buildPasswordRules();
  console.log(req.body);
  console.log("antes de validar");
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
      passwordRules,
    });
    return;
  }
  next();
};

module.exports = validate;
