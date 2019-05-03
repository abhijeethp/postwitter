const express = require("express");
const router = express.Router();
const tweetsController = require("../../controllers").tweet;
const permissionHandlerMiddleware = require("../../middleware")
  .permissionHandler;

/**
 * CREATE - COMMENT ROUTE
 *
 * @description makes currently logged in comment on a tweet.
 *
 * @param {number} tweetId ID of tweet on which the comment is to be made.
 * @param {string} text Text content of comment.
 */
router.post(
  "/",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.commentCreateController
);

/**
 * SHOW - COMMENT ROUTE
 *
 * @description returns a single comment and it's reply thread.
 *
 * @param {number} commentId ID of comment which is to be fetched.
 */
router.get(
  "/:commentId",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.commentShowController
);

/**
 * CREATE - REPLY ROUTE
 *
 * @description Create reply on a comment with another comment.
 *
 * @param {number} commentId ID of comment on which the reply comment is to be made.
 * @param {string} text Text content of reply.
 */
router.post(
  "/reply",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  tweetsController.replyController
);

module.exports = router;
