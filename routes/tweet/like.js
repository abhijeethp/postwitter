const express = require("express");
const router = express.Router();
const tweetsController = require("../../controllers").tweet;
const permissionHandlerMiddleware = require("../../middleware")
  .permissionHandler;

/**
 * LIKE ROUTE
 *
 * @description makes currently logged in user like a tweet.
 */
router.post(
  "/",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.likeController
);

/**
 * UNLIKE ROUTE
 *
 * @description makes currently logged in user unlike a tweet.
 */
router.delete(
  "/:tweetId",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.unlikeController
);

module.exports = router;
