/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");

const inventoryRouter = require("./routes/inventoryRoute");
const utilities = require("./utilities");
/* ***********************
 * View engines and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root
//will read the path ./layouts/layout and look in the views folder (indicated by the period), then for a subfolder named layouts, then for a file named layout.ejs.

/* ***********************
 * Routes
 *************************/
app.use(static);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

//index route
app.get("/", utilities.handleErrors(baseController.buildHome));

//Inventory routes
app.use("/inv", inventoryRouter);
// short, any route that starts with /inv will then be redirected to the inventoryRoute.js

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  console.log("In the router error handler");

  next({ status: 404, message: "Sorry, we appear to have lost that page." });
  //Funcionamiento de next: si se llama con un argumento, se asume que es un error y se pasa al siguiente middleware que maneje errores.
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?";
  }

  res.render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  });
});
