const express = require("express");
const router = express.Router();
const tweetsController = require("../../controllers").tweet;
const permissionHandlerMiddleware = require("../../middleware")
  .permissionHandler;

/**
 * RETWEET ROUTE
 *
 * @description makes currently logged in user retweet a tweet
 *
 * @param {number} tweetId ID of tweet to be retweeted.
 */
router.post(
  "/",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.retweetController
);

/**
 * UNRETWEET ROUTE
 *
 * @description makes currently logged in user unretweet a tweet
 *
 * @param {number} tweetId ID of tweet to be unretweeted.
 */
router.delete(
  "/:tweetId",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.unretweetController
);

module.exports = router;
