/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session");
const pool = require("./database/");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");

const inventoryRouter = require("./routes/inventoryRoute");
const accountRouter = require("./routes/accountRoute");
const utilities = require("./utilities");

/* ***********************
 * Middleware
 * ************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express Messages Middleware
app.use(require("connect-flash")()); //for flash messages
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

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
app.use("/inv", utilities.handleErrors(inventoryRouter));
// short, any route that starts with /inv will then be redirected to the inventoryRoute.js

app.use("/account", utilities.handleErrors(accountRouter));

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  if (!req.params.errorStatus) {
    console.log("In the router error handler without errorStatus");
    next({ status: 404, message: "Sorry, we appear to have lost that page." });
    return;
  }
  console.log("In the router error handler");
  next({
    status: req.params.errorStatus,
    message: "Unknown error occurred. Please try again.",
  });
  //Funcionamiento de next: si se llama con un argumento, se asume que es un error y se pasa al siguiente middleware que maneje errores.
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404 || err.status == 500) {
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
