const User = require("../../models").User;
const Tweet = require("../../models").Tweet;

/**
 * Like controller
 *
 * Likes a particular tweet
 *
 * @throws {Error} Will throw error if failed to like tweet
 */
function likeController(req, res, next) {
  return User.findByPk(req.session.user.id)
    .then(user => {
      Tweet.findByPk(req.body.tweetId)
        .then(tweet => {
          if (!tweet) {
            next(new Error("TWEET_DOES_NOT_EXIST"));
          } else {
            user
              .addLiked(tweet)
              .then(res.status(200).send("SUCCESSFULLY_LIKED_TWEET"))
              .catch(err => next(new Error("TWEET_LIKE_ERROR : " + err)));
          }
        })
        .catch(err => next(new Error("TWEET_FETCH_ERROR" + err)));
    })
    .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
}

/**
 * Unlike controller
 *
 * Unlikes a particular tweet
 *
 * @throws {Error} Will throw error if failed to unlike tweet
 */
function unlikeController(req, res, next) {
  return User.findByPk(req.session.user.id)
    .then(user => {
      Tweet.findByPk(req.params.tweetId)
        .then(tweet => {
          if (!tweet) {
            next(new Error("TWEET_DOES_NOT_EXIST"));
          } else {
            user
              .removeLiked(tweet)
              .then(res.status(200).send("SUCCESSFULLY_UNLIKED_TWEET"))
              .catch(err => next(new Error("TWEET_UNLIKE_ERROR : " + err)));
          }
        })
        .catch(err => next(new Error("TWEET_FETCH_ERROR" + err)));
    })
    .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
}

module.exports = {
  likeController,
  unlikeController
};
