const invModel = require("../models/inventory-model");
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
