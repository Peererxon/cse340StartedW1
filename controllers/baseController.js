const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  // req.flash("notice", "This is a flash message."); //flash function was added in the file server.js with the connect-flash package
  // the first parameter become the class of the element, the second parameter is the message
  res.render("index", { title: "Home", nav, errors: null });
};

baseController.buildError = async function (req, res, next) {
  const errorStatus = req.params.errorStatus;
  const nav = await utilities.getNav();
  res.status(500).send("Internal Server Error");
};

module.exports = baseController;
