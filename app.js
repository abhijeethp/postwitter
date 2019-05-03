var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
var dotenv = require("dotenv");
var session = require("express-session");

// -- APP CONFIG -- //
dotenv.config();
var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({ secret: "SUPER SECRET", saveUninitialized: true, resave: true })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// -- REGISTER APP ROUTES -- //
app.use("/", require("./routes"));

// -- REGISTER ERROR HANDLING MIDDLEWARE -- //
app.use(require("./middleware").errorHandler);

module.exports = app;
