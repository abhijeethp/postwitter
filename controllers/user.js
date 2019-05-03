const User = require("../models").User;

/**
 * Follow controller
 *
 * @description makes current user follow another user
 */
function follow(req, res, next) {
  return User.findByPk(req.session.user.id)
    .then(follower => {
      User.findByPk(req.body.userId)
        .then(followed => {
          if (!followed) {
            next(new Error("USER_DOES_NOT_EXIST"));
          } else {
            follower
              .addFollowing(followed)
              .then(res.status(200).send("SUCCESSFULLY_FOLLOWED"))
              .catch(err => next(new Error("USER_FOLLOW_ERROR : " + err)));
          }
        })
        .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
    })
    .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
}

/**
 * Unfollow controller
 *
 * @description makes current user Unfollow another user
 */
function unfollow(req, res, next) {
  return User.findByPk(req.session.user.id)
    .then(follower => {
      User.findByPk(req.params.userId)
        .then(followed => {
          if (!followed) {
            next(new Error("USER_DOES_NOT_EXIST"));
          } else {
            follower
              .removeFollowing(followed)
              .then(res.status(200).send("SUCCESSFULLY_UNFOLLOWED"))
              .catch(err => next(new Error("USER_UNFOLLOW_ERROR : " + err)));
          }
        })
        .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
    })
    .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
}

module.exports = { follow, unfollow };
