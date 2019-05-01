var express = require("express");
var router = express.Router();
const tweetsController = require("../controllers").tweets;
const permissionHandlerMiddleware = require("../middleware").permissionHandler;
const inputValidationMiddleware = require("../middleware").inputValidation;

/**
 * INDEX ROUTE
 *
 * @description returns a list of tweets for currently logged in user.
 */
router.get(
  "/",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.indexController
);

/**
 * CREATE ROUTE
 *
 * @description Creates a new tweet for currently logged in user.
 */
router.post(
  "/",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  inputValidationMiddleware.validateTweetInputs,
  tweetsController.createController
);

/**
 * SHOW ROUTE
 *
 * @description returns a single tweet.
 */
router.get(
  "/:tweetId",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.showController
);

/**
 * DELETE ROUTE
 *
 * @description deletes a tweet.
 */
router.delete(
  "/:tweetId",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.deleteController
);

module.exports = router;
