const User = require("../../models").User;
const Tweet = require("../../models").Tweet;
const Comment = require("../../models").Comment;
/**
 * Retweet controller
 *
 * Retweets a particular tweet
 *
 * @throws {Error} Will throw error if failed to retweet tweet
 */
function retweetController(req, res, next) {
  return User.findByPk(req.session.user.id)
    .then(user => {
      Tweet.findByPk(req.body.tweetId)
        .then(tweet => {
          if (!tweet) {
            next(new Error("TWEET_DOES_NOT_EXIST"));
          } else {
            user
              .addRetweeted(tweet)
              .then(res.status(200).send("SUCCESSFULLY_RETWEETED_TWEET"))
              .catch(err => next(new Error("TWEET_RETWEET_ERROR : " + err)));
          }
        })
        .catch(err => next(new Error("TWEET_FETCH_ERROR" + err)));
    })
    .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
}

/**
 * Unretweet controller
 *
 * Unretweets a particular tweet
 *
 * @throws {Error} Will throw error if failed to unretweet tweet
 */
function unretweetController(req, res, next) {
  return User.findByPk(req.session.user.id)
    .then(user => {
      Tweet.findByPk(req.params.tweetId)
        .then(tweet => {
          if (!tweet) {
            next(new Error("TWEET_DOES_NOT_EXIST"));
          } else {
            user
              .removeRetweeted(tweet)
              .then(res.status(200).send("SUCCESSFULLY_UNRETWEETED_TWEET"))
              .catch(err => next(new Error("TWEET_UNRETWEET_ERROR : " + err)));
          }
        })
        .catch(err => next(new Error("TWEET_FETCH_ERROR" + err)));
    })
    .catch(err => next(new Error("USER_FETCH_ERROR" + err)));
}

module.exports = { retweetController, unretweetController };
