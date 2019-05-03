var express = require("express");
var router = express.Router();
const usersController = require("../controllers").users;
const permissionHandlerMiddleware = require("../middleware").permissionHandler;
const inputValidationMiddleware = require("../middleware").inputValidation;

/**
 * HOME ROUTE
 *
 * @description returns a greeting message.
 */
router.get("/", function(req, res, next) {
  res.status(200).send("WELCOME TO POSTWITTER");
});

/**
 * REGISTER ROUTE
 *
 * @description registers a new user.
 */
router.post(
  "/register",
  permissionHandlerMiddleware.proceedIfNotLoggedIn,
  inputValidationMiddleware.validateRegisterInputs,
  usersController.register
);

/**
 * LOGIN ROUTE
 *
 * @description authenticates and logs in an existing user.
 */
router.post(
  "/login",
  permissionHandlerMiddleware.proceedIfNotLoggedIn,
  inputValidationMiddleware.validateLoginInputs,
  usersController.login
);

/**
 * LOGOUT ROUTE
 *
 * @description logs out currently logged in user.
 */
router.get(
  "/logout",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  usersController.logout
);

/**
 * ME ROUTE
 *
 * @description returns currently logged in user.
 */
router.get(
  "/me",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  usersController.me
);

module.exports = router;
