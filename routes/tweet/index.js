const express = require("express");
const router = express.Router();
const tweetsController = require("../../controllers").tweet;
const permissionHandlerMiddleware = require("../../middleware")
  .permissionHandler;
const inputValidationMiddleware = require("../../middleware").inputValidation;

/**
 * TWEET - INDEX ROUTE
 *
 * @description returns a list of tweets for currently logged in user.
 */
router.get(
  "/",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.indexController
);

/**
 * TWEET - CREATE ROUTE
 *
 * @description Creates a new tweet for currently logged in user.
 *
 * @param {string} text The text content of the tweet.
 */
router.post(
  "/",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  inputValidationMiddleware.validateTweetInputs,
  tweetsController.createController
);

/**
 * TWEET - SHOW ROUTE
 *
 * @description returns a single tweet, it's tweeter and it's comment thread.
 *
 * @param {number} tweetId ID of tweet to be fetched.
 */
router.get(
  "/:tweetId",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.showController
);

/**
 * TWEET - DELETE ROUTE
 *
 * @description deletes a tweet.
 *
 * @param {number} tweetId ID of tweet to be deleted.
 */
router.delete(
  "/:tweetId",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.deleteController
);

router.use("/like", require("./like"));
router.use("/retweet", require("./retweet"));
router.use("/comment", require("./comment"));

module.exports = router;
