const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
};

baseController.buildError = async function (req, res, next) {
  const errorStatus = req.params.errorStatus;
  const nav = await utilities.getNav();
  res.status(500).send("Internal Server Error");
};

module.exports = baseController;
