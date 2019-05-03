const express = require("express");
const router = express.Router();
const authController = require("../controllers").auth;
const permissionHandlerMiddleware = require("../middleware").permissionHandler;
const inputValidationMiddleware = require("../middleware").inputValidation;

/**
 * REGISTER ROUTE
 *
 * @description registers a new user.
 *
 * @param {string} email
 * @param {string} displayName
 * @param {string} password
 * @param {string} username
 */
router.post(
  "/register",
  permissionHandlerMiddleware.proceedIfNotLoggedIn,
  inputValidationMiddleware.validateRegisterInputs,
  authController.register
);

/**
 * LOGIN ROUTE
 *
 * @description authenticates and logs in an existing user.
 *
 * @param {string} username User's username or email address.
 * @param {string} password
 */
router.post(
  "/login",
  permissionHandlerMiddleware.proceedIfNotLoggedIn,
  inputValidationMiddleware.validateLoginInputs,
  authController.login
);

/**
 * LOGOUT ROUTE
 *
 * @description logs out currently logged in user.
 */
router.post(
  "/logout",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  authController.logout
);

/**
 * ME ROUTE
 *
 * @description returns currently logged in user.
 */
router.get(
  "/me",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  authController.me
);

module.exports = router;
