var express = require("express");
var router = express.Router();
const usersController = require("../controllers").users;
const permissionHandlerMiddleware = require("../middleware").permissionHandler;

/**
 * FOLLOW ROUTE
 *
 * @description follows a user.
 */
router.get(
  "/follow/:userId",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  (req, res, next) =>
    req.session.user.id != req.params.userId
      ? next()
      : next(Error("CANNOT_FOLLOW_YOURSELF")),
  usersController.follow
);

/**
 * UNFOLLOW ROUTE
 *
 * @description unfollows a user.
 */
router.get(
  "/unfollow/:userId",
  permissionHandlerMiddleware.proceedIfLoggedIn,
  (req, res, next) =>
    req.session.user.id != req.params.userId
      ? next()
      : next(Error("CANNOT_UNFOLLOW_YOURSELF")),
  usersController.unfollow
);

module.exports = router;
