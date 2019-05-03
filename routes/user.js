const express = require("express");
const router = express.Router();
const userController = require("../controllers").user;
const permissionHandlerMiddleware = require("../middleware").permissionHandler;

/**
 * FOLLOW ROUTE
 *
 * @description follows a user.
 *
 * @param {number} userId ID of user to be followed by current user.
 */

router.post(
  "/follow",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  (req, res, next) =>
    req.session.user.id != req.body.userId
      ? next()
      : next(Error("CANNOT_FOLLOW_YOURSELF")),
  userController.follow
);

/**
 * UNFOLLOW ROUTE
 *
 * @description unfollows a user.
 *
 * @param {number} userId ID of user to be unfollowed by current user.
 */
router.delete(
  "/follow/:userId",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  (req, res, next) =>
    req.session.user.id != req.params.userId
      ? next()
      : next(Error("CANNOT_UNFOLLOW_YOURSELF")),
  userController.unfollow
);

module.exports = router;
