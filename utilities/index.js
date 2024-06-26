const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list +=
    '<li class=navigationOption><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li class=navigationOption>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display" class="cars-catalog">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildCarDetailGrid = async function (data) {
  let pageTitle = `<h2>${data[0].inv_make} ${data[0].inv_model} </h2>`;
  let innerHTML = `
  <article class="detailGrid">

    <div class="detailGrid__img">
      <img src="${data[0].inv_image}" alt="Car model front image" />
    </div>
    
    <div class="detailGrid__about">
      <p>${data[0].inv_description}</p>
      <span>
          <strong>Price:</strong>
          $${new Intl.NumberFormat("en-US").format(data[0].inv_price)}
      </span>
      <time datetime="${data[0].inv_year}"><b>Year:</b> 
        ${data[0].inv_year}
      </time>
      <span><b>Color:</b> ${data[0].inv_color}</span>
      <span><b>Brand:</b> ${data[0].inv_make}</span>
      <span><b>Model:</b> ${data[0].inv_model}</span>
      <span><b>Miles travelled:</b> ${new Intl.NumberFormat("en-Us").format(
        data[0].inv_miles
      )}</span>
    </div>
  </article>
  `;
  const view = pageTitle + innerHTML;
  return view;
};

Util.buildPasswordRules = function () {
  let rules = ` 
   <div>
    <div class="form__field">
      <strong id="length" for="length">At least 12 characters</strong>
    </div>
    <div class="form__field">
      <strong id="digit" for="digit">At least one digit</strong>
    </div>
    <div class="form__field">
      <strong id="lowercase" for="lowercase">At least one lowercase letter</strong>
    </div>
    <div class="form__field">
      <strong id="uppercase" for="uppercase">At least one uppercase letter</strong>
    </div>
    <div class="form__field">
      <strong id="nonAlphaNumeric" for="nonAlphaNumeric"> At least one non-alphanumeric character</strong>
    </div>
  </div>`;
  return rules;
  //autocomplete
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        //console.table(accountData);
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    res.locals.loggedin = 0;
    next();
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @description Middleware to check if the user is admin to protect routes
 */

Util.checkAdminGuard = (req, res, next) => {
  const userAllowed =
    res.locals.accountData?.account_type === "admin" ||
    res.locals.accountData?.account_type === "Employee";
  if (userAllowed) {
    next();
  } else {
    req.flash("notice", "You are not authorized to view this page.");
    res.redirect("/account/login");
  }
};
module.exports = Util;
